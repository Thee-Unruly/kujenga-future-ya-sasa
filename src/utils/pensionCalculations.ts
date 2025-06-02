
import { PensionData, PensionResults, ProjectionDataPoint, ScenarioResult } from "@/types/pension";

export const calculatePensionProjection = (data: PensionData): PensionResults => {
  const yearsToRetirement = data.retirementAge - data.currentAge;
  const monthsToRetirement = yearsToRetirement * 12;
  
  // Calculate annual income based on income type
  let annualIncome = 0;
  if (data.incomeType === 'monthly') {
    annualIncome = data.monthlyIncome * 12;
  } else if (data.incomeType === 'seasonal') {
    // For seasonal, use monthly income as average
    annualIncome = data.monthlyIncome * 12;
  } else {
    // For random/gig work, use monthly income as average
    annualIncome = data.monthlyIncome * 12;
  }

  const monthlyContribution = (annualIncome * data.contributionPercentage / 100) / 12;

  // Investment return rates based on risk profile
  const returnRates = {
    low: 0.07,
    medium: 0.10,
    high: 0.135
  };

  const annualReturn = returnRates[data.investmentRisk];
  const monthlyReturn = annualReturn / 12;

  // Calculate future value of annuity
  const futureValue = monthlyContribution * 
    (Math.pow(1 + monthlyReturn, monthsToRetirement) - 1) / monthlyReturn;

  // Calculate required corpus (assuming 4% withdrawal rate)
  const annualExpensesAtRetirement = data.monthlyExpenses * 12 * 0.8; // 80% of current expenses
  const inflationRate = 0.055;
  const inflationAdjustedExpenses = annualExpensesAtRetirement * 
    Math.pow(1 + inflationRate, yearsToRetirement);
  const requiredCorpus = inflationAdjustedExpenses / 0.04; // 4% rule

  // Calculate funding gap
  const fundingGap = Math.max(0, requiredCorpus - futureValue);

  // Generate projection data
  const projectionData: ProjectionDataPoint[] = [];
  let balance = 0;
  
  for (let year = 0; year <= yearsToRetirement; year++) {
    const age = data.currentAge + year;
    const monthsElapsed = year * 12;
    
    if (year > 0) {
      // Calculate balance with compound interest
      const annualContribution = monthlyContribution * 12;
      balance = (balance + annualContribution) * (1 + annualReturn);
    }
    
    const inflationAdjustedBalance = balance / Math.pow(1 + inflationRate, year);
    
    projectionData.push({
      age,
      year: new Date().getFullYear() + year,
      contribution: monthlyContribution * 12,
      balance,
      inflationAdjustedBalance
    });
  }

  // Generate scenario results (Monte Carlo simulation simplified)
  const scenarios: ScenarioResult[] = [
    {
      scenario: 'Conservative',
      finalCorpus: futureValue * 0.85,
      probability: 30,
      risk: 'Low'
    },
    {
      scenario: 'Expected',
      finalCorpus: futureValue,
      probability: 50,
      risk: 'Medium'
    },
    {
      scenario: 'Optimistic',
      finalCorpus: futureValue * 1.25,
      probability: 20,
      risk: 'High'
    }
  ];

  return {
    projectedCorpus: futureValue,
    requiredCorpus,
    monthlyContribution,
    fundingGap,
    yearsToRetirement,
    projectionData,
    scenarios
  };
};
