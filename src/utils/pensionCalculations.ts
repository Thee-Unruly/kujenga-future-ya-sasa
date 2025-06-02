import { PensionData, PensionResults, ProjectionDataPoint, ScenarioResult, RiskProfile } from "@/types/pension";

export const calculatePensionProjection = (data: PensionData): PensionResults => {
  // Default assumptions if not provided
  const defaults = {
    inflationRate: 0.055, // 5.5%
    withdrawalRate: 0.04, // 4%
    postRetirementExpenseRatio: 0.8, // 80%
    lifeExpectancy: 80, // years
  };

  // Use provided or default values
  const inflationRate = data.inflationRate ?? defaults.inflationRate;
  const withdrawalRate = data.withdrawalRate ?? defaults.withdrawalRate;
  const postRetirementExpenseRatio = data.postRetirementExpenseRatio ?? defaults.postRetirementExpenseRatio;

  // Validate inputs
  const errors: string[] = [];
  if (data.currentAge < 18) errors.push("Current age must be at least 18.");
  if (data.retirementAge < data.currentAge) errors.push("Retirement age must be at least current age.");
  if (data.monthlyExpenses < 0) errors.push("Monthly expenses cannot be negative.");
  if (data.contributionPercentage < 0 || data.contributionPercentage > 100)
    errors.push("Contribution percentage must be between 0 and 100.");
  if (!["low", "medium", "high"].includes(data.investmentRisk)) errors.push("Invalid investment risk profile.");
  if (data.incomeType === "monthly" && (data.monthlyIncome == null || data.monthlyIncome < 0))
    errors.push("Monthly income is required and cannot be negative for monthly income type.");
  if (data.incomeType === "seasonal" && (!data.seasonalIncomes || data.seasonalIncomes.length === 0))
    errors.push("Seasonal incomes are required for seasonal income type.");
  if (data.incomeType === "random" && (!data.gigIncomes || data.gigIncomes.length === 0))
    errors.push("Gig incomes are required for random income type.");

  if (errors.length > 0) {
    return {
      projectedCorpus: 0,
      requiredCorpus: 0,
      monthlyContribution: 0,
      fundingGap: 0,
      yearsToRetirement: 0,
      projectionData: [],
      scenarios: [],
      error: errors.join(" "),
    };
  }

  const yearsToRetirement = Math.max(data.retirementAge - data.currentAge, 0);
  const monthsToRetirement = yearsToRetirement * 12;

  // Calculate annual income based on income type
  let annualIncome = 0;
  if (data.incomeType === "monthly") {
    annualIncome = (data.monthlyIncome || 0) * 12;
  } else if (data.incomeType === "seasonal") {
    annualIncome = data.seasonalIncomes?.reduce((sum, si) => sum + (si.amount || 0), 0) || 0;
  } else if (data.incomeType === "random") {
    annualIncome =
      data.gigIncomes?.reduce((sum, gi) => sum + (gi.amount || 0) * (gi.frequencyPerYear || 1), 0) || 0;
  }

  // Calculate monthly contribution
  const monthlyContribution = (annualIncome * data.contributionPercentage) / 100 / 12;

  // Investment return rates based on risk profile
  const returnRates: Record<RiskProfile, number> = {
    low: 0.07, // Average of 6-8%
    medium: 0.10, // Average of 8-12%
    high: 0.135, // Average of 12-15%
  };
  const annualReturn = returnRates[data.investmentRisk];
  const monthlyReturn = Math.pow(1 + annualReturn, 1 / 12) - 1; // Correct monthly compounding rate

  // Calculate future value of monthly contributions
  const futureValue =
    monthsToRetirement === 0
      ? 0
      : monthlyContribution * ((Math.pow(1 + monthlyReturn, monthsToRetirement) - 1) / monthlyReturn);

  // Calculate required corpus
  const annualExpensesAtRetirement = data.monthlyExpenses * 12 * postRetirementExpenseRatio;
  const inflationAdjustedExpenses =
    annualExpensesAtRetirement * Math.pow(1 + inflationRate, yearsToRetirement);
  const requiredCorpus = inflationAdjustedExpenses / withdrawalRate;

  // Calculate funding gap
  const fundingGap = Math.max(0, requiredCorpus - futureValue);

  // Generate projection data with monthly compounding
  const projectionData: ProjectionDataPoint[] = [];
  let balance = 0;

  for (let year = 0; year <= yearsToRetirement; year++) {
    const age = data.currentAge + year;
    const monthsElapsed = year * 12;

    for (let month = 0; month < 12 && monthsElapsed + month < monthsToRetirement; month++) {
      balance = (balance + monthlyContribution) * (1 + monthlyReturn);
    }

    const inflationAdjustedBalance = balance / Math.pow(1 + inflationRate, year);

    projectionData.push({
      age,
      year: new Date().getFullYear() + year,
      contribution: monthlyContribution * 12,
      balance,
      inflationAdjustedBalance,
    });
  }

  // Generate scenario results
  const scenarioMultipliers: Record<RiskProfile, [number, number, number]> = {
    low: [0.85, 1.0, 1.15], // Conservative, Expected, Optimistic
    medium: [0.90, 1.0, 1.20],
    high: [0.80, 1.0, 1.30], // Wider range for higher risk
  };
  const probabilities = [30, 50, 20]; // Conservative, Expected, Optimistic
  const scenarios: ScenarioResult[] = [
    {
      scenario: "Conservative",
      finalCorpus: futureValue * scenarioMultipliers[data.investmentRisk][0],
      probability: probabilities[0],
      risk: data.investmentRisk,
    },
    {
      scenario: "Expected",
      finalCorpus: futureValue * scenarioMultipliers[data.investmentRisk][1],
      probability: probabilities[1],
      risk: data.investmentRisk,
    },
    {
      scenario: "Optimistic",
      finalCorpus: futureValue * scenarioMultipliers[data.investmentRisk][2],
      probability: probabilities[2],
      risk: data.investmentRisk,
    },
  ];

  return {
    projectedCorpus: Math.round(futureValue),
    requiredCorpus: Math.round(requiredCorpus),
    monthlyContribution: Math.round(monthlyContribution),
    fundingGap: Math.round(fundingGap),
    yearsToRetirement,
    projectionData,
    scenarios,
  };
};
