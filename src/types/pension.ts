
// Define constrained types for clarity
export type IncomeType = 'monthly' | 'seasonal' | 'random';
export type RiskProfile = 'low' | 'medium' | 'high';
type Month =
  | 'January'
  | 'February'
  | 'March'
  | 'April'
  | 'May'
  | 'June'
  | 'July'
  | 'August'
  | 'September'
  | 'October'
  | 'November'
  | 'December';

export interface PensionData {
  incomeType: IncomeType;
  monthlyIncome?: number; // Optional for seasonal/random
  seasonalIncomes?: SeasonalIncome[]; // Optional for seasonal
  gigIncomes?: GigIncome[]; // Optional for random
  seasonalIncome?: number; // For seasonal income type
  seasonsPerYear?: number; // For seasonal income type
  averageGigIncome?: number; // For random income type
  gigsPerYear?: number; // For random income type
  currentAge: number; // Should be >= 18
  retirementAge: number; // Should be >= currentAge
  monthlyExpenses: number; // Should be >= 0
  investmentRisk: RiskProfile;
  contributionPercentage: number; // Should be 0–100
  inflationRate?: number; // e.g., 0.055 for 5.5%
  withdrawalRate?: number; // e.g., 0.04 for 4%
  postRetirementExpenseRatio?: number; // e.g., 0.8 for 80%
  lifeExpectancy?: number; // e.g., 80 years
  salaryGrowthRate?: number; // e.g., 0.03 for 3%
}

export interface SeasonalIncome {
  month: Month; // Constrained to valid months
  amount: number; // Should be >= 0
}

export interface GigIncome {
  id: string; // Unique identifier for each gig
  amount: number; // Should be >= 0
  frequencyPerYear: number; // e.g., 12 for monthly gigs
}

export interface PensionResults {
  projectedCorpus: number;
  requiredCorpus: number;
  monthlyContribution: number;
  fundingGap: number;
  yearsToRetirement: number;
  projectionData: ProjectionDataPoint[];
  scenarios?: ScenarioResult[]; // Optional for flexibility
  error?: string; // Optional for error reporting
}

export interface ProjectionDataPoint {
  age: number;
  year: number;
  contribution: number;
  balance: number;
  inflationAdjustedBalance?: number; // Optional to support cases without inflation adjustment
}

export interface ScenarioResult {
  scenario: 'Conservative' | 'Expected' | 'Optimistic'; // Constrained scenarios
  finalCorpus: number;
  probability: number; // Should be 0–100
  risk: RiskProfile; // Align with investmentRisk
}
