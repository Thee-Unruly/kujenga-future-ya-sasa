import { PensionData, PensionResults, ProjectionDataPoint, ScenarioResult } from "@/types/pension";

// Extend PensionData to include economic assumptions
interface PensionData {
  incomeType: "monthly" | "seasonal" | "random";
  monthlyIncome: number;
  seasonalIncome?: number;
  seasonsPerYear?: number;
  averageGigIncome?: number;
  gigsPerYear?: number;
  currentAge: number;
  retirementAge: number;
  monthlyExpenses: number;
  contributionPercentage: number;
  investmentRisk: "low" | "medium" | "high";
  inflationRate?: number; // e.g., 0.055 for 5.5%
  withdrawalRate?: number; // e.g., 0.04 for 4%
  postRetirementExpenseRatio?: number; // e.g., 0.8 for 80%
}

export const calculatePensionProjection = (data: PensionData): PensionResults => {
  // Default assumptions if not provided
  const defaults = {
    inflationRate: 0.055,
    withdrawalRate: 0.04,
    postRetirementExpenseRatio: 0.8,
  };

  // Use provided or default values
  const inflationRate = data.inflationRate ?? defaults.inflationRate;
  const withdrawalRate = data.withdrawalRate ?? defaults.withdrawalRate;
  const postRetirementExpenseRatio = data.postRetirementExpenseRatio ?? defaults.postRetirementExpenseRatio;

  // Validate inputs
  if (
    data.currentAge < 18 ||
    data.retirementAge < data.currentAge ||
    data.monthlyIncome < 0 ||
    data.contributionPercentage < 0 ||
    data.monthlyExpenses < 0 ||
    !["low", "medium", "high"].includes(data.investmentRisk)
  ) {
    throw new Error("Invalid input data: Check age, income, contribution percentage, or risk profile.");
  }

  const yearsToRetirement = Math.max(data.retirementAge - data.currentAge, 0);
  const monthsToRetirement = yearsToRetirement * 12;

  // Calculate annual income based on income type
  let annualIncome = 0;
  if (data.incomeType === "monthly") {
    annualIncome = data.monthlyIncome * 12;
  } else if (data.incomeType === "seasonal") {
    annualIncome = (data.seasonalIncome || 0) * (data.seasonsPerYear || 1);
  } else if (data.incomeType === "random") {
    annualIncome = (data.averageGigIncome || 0) * (data.gigsPerYear || 1);
  }

  const monthlyContribution = (annualIncome * data.contributionPercentage) / 100 / 12;

  // Investment return rates based on risk profile
  const returnRates = {
    low: 0.07, // Average of 6-8%
    medium: 0.10, // Average of 8-12%
    high: 0.135, // Average of 12-15%
  };
  const annualReturn = returnRates[data.investmentRisk];
  const monthlyReturn = Math.pow(1 + annualReturn, 1 / 12) - 1; // Correct monthly compounding rate

  // Calculate future value of monthly contributions
  const futureValue =
    monthlyContribution *
    ((Math.pow(1 + monthlyReturn, monthsToRetirement) - 1) / monthlyReturn);

  // Calculate required corpus
  const annualExpensesAtRetirement = data.monthlyExpenses * 12 * postRetirementExpenseRatio;
  const inflationAdjustedExpenses = annualExpensesAtRetirement * Math.pow(1 + inflationRate, yearsToRetirement);
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

  // Generate scenario results (simplified Monte Carlo with dynamic risk alignment)
  const scenarioMultipliers = {
    low: [0.85, 1.0, 1.15], // Conservative, Expected, Optimistic for low risk
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