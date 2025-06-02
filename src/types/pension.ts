
export interface PensionData {
  incomeType: 'monthly' | 'seasonal' | 'random';
  monthlyIncome: number;
  seasonalIncomes: SeasonalIncome[];
  currentAge: number;
  retirementAge: number;
  monthlyExpenses: number;
  investmentRisk: 'low' | 'medium' | 'high';
  contributionPercentage: number;
}

export interface SeasonalIncome {
  month: string;
  amount: number;
}

export interface PensionResults {
  projectedCorpus: number;
  requiredCorpus: number;
  monthlyContribution: number;
  fundingGap: number;
  yearsToRetirement: number;
  projectionData: ProjectionDataPoint[];
  scenarios: ScenarioResult[];
}

export interface ProjectionDataPoint {
  age: number;
  year: number;
  contribution: number;
  balance: number;
  inflationAdjustedBalance: number;
}

export interface ScenarioResult {
  scenario: string;
  finalCorpus: number;
  probability: number;
  risk: string;
}
