import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PensionData } from "@/types/pension";

interface ScenarioSimulationProps {
  data: PensionData;
  onUpdate: (data: Partial<PensionData>) => void;
}

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
  lifeExpectancy?: number; // e.g., 75
  salaryGrowthRate?: number; // e.g., 0.03 for 3%
  postRetirementExpenseRatio?: number; // e.g., 0.8 for 80%
}

export const ScenarioSimulation = ({ data, onUpdate }: ScenarioSimulationProps) => {
  // Risk profiles with dynamic return ranges
  const riskProfiles = {
    low: { return: [0.06, 0.08], description: "Government bonds, fixed deposits" },
    medium: { return: [0.08, 0.12], description: "Balanced funds, NSSF schemes" },
    high: { return: [0.12, 0.15], description: "Equity funds, stocks" },
  };

  // Default economic assumptions if not provided in data
  const defaultAssumptions = {
    inflationRate: 0.055,
    lifeExpectancy: 75,
    salaryGrowthRate: 0.03,
    postRetirementExpenseRatio: 0.8,
  };

  // Use provided or default values
  const assumptions = {
    inflationRate: data.inflationRate ?? defaultAssumptions.inflationRate,
    lifeExpectancy: data.lifeExpectancy ?? defaultAssumptions.lifeExpectancy,
    salaryGrowthRate: data.salaryGrowthRate ?? defaultAssumptions.salaryGrowthRate,
    postRetirementExpenseRatio:
      data.postRetirementExpenseRatio ?? defaultAssumptions.postRetirementExpenseRatio,
  };

  // Calculate projected savings for the selected risk profile
  const projectedSavings = useMemo(() => {
    const yearsUntilRetirement = Math.max(data.retirementAge - data.currentAge, 0);
    const avgReturn = (riskProfiles[data.investmentRisk].return[0] + riskProfiles[data.investmentRisk].return[1]) / 2;
    let annualIncome = 0;
    if (data.incomeType === "monthly") {
      annualIncome = data.monthlyIncome * 12;
    } else if (data.incomeType === "seasonal") {
      annualIncome = (data.seasonalIncome || 0) * (data.seasonsPerYear || 1);
    } else if (data.incomeType === "random") {
      annualIncome = (data.averageGigIncome || 0) * (data.gigsPerYear || 1);
    }
    const annualContribution = (annualIncome * data.contributionPercentage) / 100;
    // Simplified compound interest: FV = PV * (1 + r)^n
    const futureValue = annualContribution * ((Math.pow(1 + avgReturn, yearsUntilRetirement) - 1) / avgReturn);
    return Math.round(futureValue);
  }, [
    data.investmentRisk,
    data.incomeType,
    data.monthlyIncome,
    data.seasonalIncome,
    data.seasonsPerYear,
    data.averageGigIncome,
    data.gigsPerYear,
    data.contributionPercentage,
    data.currentAge,
    data.retirementAge,
  ]);

  // Dynamic tip based on user data
  const smartTip = useMemo(() => {
    if (data.currentAge < 30) {
      return "You're starting early—great move! Small, consistent contributions now can grow significantly due to compounding.";
    } else if (data.contributionPercentage < 10) {
      return "Consider increasing your contribution percentage to boost your retirement savings over time.";
    } else {
      return `Your ${data.investmentRisk} risk profile balances growth and stability. Adjust it based on your comfort with market fluctuations.`;
    }
  }, [data.currentAge, data.contributionPercentage, data.investmentRisk]);

  // Format percentage
  const formatPercentage = (value: number) => `${(value * 100).toFixed(1)}%`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-white to-gray-50 backdrop-blur-md border-0 shadow-lg hover:shadow-xl transition-shadow duration-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <motion.span
              className="text-purple-600"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              📊
            </motion.span>
            Investment Scenarios
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <Label htmlFor="investmentRisk" className="text-sm font-medium text-gray-700">
                Investment Risk Profile
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <span className="text-gray-500">ⓘ</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Choose a risk level that matches your investment comfort.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select
              value={data.investmentRisk}
              onValueChange={(value: "low" | "medium" | "high") => {
                if (value in riskProfiles) {
                  onUpdate({ investmentRisk: value });
                }
              }}
            >
              <SelectTrigger className="mt-1 bg-white hover:bg-gray-50 transition-colors duration-150">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {Object.entries(riskProfiles).map(([key, { return: [min, max], description }]) => (
                  <SelectItem key={key} value={key}>
                    <div>
                      <div className="font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                      <div className="text-xs text-gray-500">
                        Expected: {formatPercentage(min)} - {formatPercentage(max)}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">{riskProfiles[data.investmentRisk].description}</p>
          </div>

          {/* Economic Assumptions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-50 rounded-lg p-4 space-y-3"
          >
            <h4 className="font-medium text-gray-800 text-sm">Economic Assumptions</h4>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-1">
                <span className="text-gray-600">Inflation Rate:</span>
                <span className="font-medium">{formatPercentage(assumptions.inflationRate)}</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="text-gray-500">ⓘ</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Annual increase in cost of living.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-600">Life Expectancy:</span>
                <span className="font-medium">{assumptions.lifeExpectancy} years</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="text-gray-500">ⓘ</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Expected age for retirement planning.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-600">Salary Growth:</span>
                <span className="font-medium">{formatPercentage(assumptions.salaryGrowthRate)}</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="text-gray-500">ⓘ</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Expected annual increase in income.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-600">Post-retirement:</span>
                <span className="font-medium">{formatPercentage(assumptions.postRetirementExpenseRatio)} of expenses</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="text-gray-500">ⓘ</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Percentage of current expenses needed after retirement.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </motion.div>

          {/* Projected Savings */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-blue-50 rounded-lg p-4"
          >
            <h4 className="font-medium text-blue-800 text-sm mb-2">Projected Savings</h4>
            <p className="text-sm font-medium text-blue-700">
              Estimated Retirement Corpus: <span className="font-bold">KES {projectedSavings.toLocaleString()}</span>
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Based on {formatPercentage(riskProfiles[data.investmentRisk].return[0])} -{" "}
              {formatPercentage(riskProfiles[data.investmentRisk].return[1])} expected return
            </p>
          </motion.div>

          {/* Dynamic Smart Tip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-green-50 rounded-lg p-4"
          >
            <h4 className="font-medium text-green-800 text-sm mb-2">💡 Smart Tip</h4>
            <p className="text-xs text-green-700">{smartTip}</p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};