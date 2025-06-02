import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PensionData } from "@/types/pension";

interface IncomeModelingCardProps {
  data: PensionData;
  onUpdate: (data: Partial<PensionData>) => void;
}

// Extend PensionData to support seasonal and random income types
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
}

export const IncomeModelingCard = ({ data, onUpdate }: IncomeModelingCardProps) => {
  const [errors, setErrors] = useState<Partial<Record<keyof PensionData, string>>>({});

  // Validation logic
  const validateInput = (key: keyof PensionData, value: number) => {
    const validations: Partial<Record<keyof PensionData, (v: number) => string | null>> = {
      currentAge: (v) => (v < 18 || v > 65 ? "Age must be between 18 and 65" : null),
      retirementAge: (v) =>
        v < 50 || v > 70 ? "Retirement age must be between 50 and 70" : null,
      monthlyIncome: (v) => (v < 0 ? "Income cannot be negative" : null),
      seasonalIncome: (v) => (v < 0 ? "Income cannot be negative" : null),
      averageGigIncome: (v) => (v < 0 ? "Income cannot be negative" : null),
      seasonsPerYear: (v) => (v < 1 || v > 12 ? "Seasons must be between 1 and 12" : null),
      gigsPerYear: (v) => (v < 1 ? "Gigs must be at least 1" : null),
      monthlyExpenses: (v) => (v < 0 ? "Expenses cannot be negative" : null),
      contributionPercentage: (v) =>
        v < 5 || v > 50 ? "Contribution must be between 5% and 50%" : null,
    };
    return validations[key]?.(value) || null;
  };

  const handleInputChange = (key: keyof PensionData, value: number) => {
    const error = validateInput(key, value);
    setErrors((prev) => ({ ...prev, [key]: error }));
    if (!error) onUpdate({ [key]: value });
  };

  // Calculate estimated savings
  const estimatedSavings = useMemo(() => {
    const yearsUntilRetirement = Math.max(data.retirementAge - data.currentAge, 0);
    let annualIncome = 0;
    if (data.incomeType === "monthly") {
      annualIncome = data.monthlyIncome * 12;
    } else if (data.incomeType === "seasonal") {
      annualIncome = (data.seasonalIncome || 0) * (data.seasonsPerYear || 1);
    } else if (data.incomeType === "random") {
      annualIncome = (data.averageGigIncome || 0) * (data.gigsPerYear || 1);
    }
    const annualContribution = (annualIncome * (data.contributionPercentage || 0)) / 100;
    const totalSavings = annualContribution * yearsUntilRetirement;
    return Math.round(totalSavings);
  }, [
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
              className="text-blue-600"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              💰
            </motion.span>
            Income Modeling
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <Label htmlFor="incomeType" className="text-sm font-medium text-gray-700">
                Income Pattern
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <span className="text-gray-500">ⓘ</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Select how you typically earn income.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select
              value={data.incomeType}
              onValueChange={(value: "monthly" | "seasonal" | "random") =>
                onUpdate({ incomeType: value })
              }
            >
              <SelectTrigger className="mt-1 bg-white hover:bg-gray-50 transition-colors duration-150">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="monthly">Monthly (Stable)</SelectItem>
                <SelectItem value="seasonal">Seasonal (Variable)</SelectItem>
                <SelectItem value="random">Irregular (Gig work)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">Choose your typical income pattern</p>
          </div>

          {data.incomeType === "monthly" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-2">
                <Label htmlFor="monthlyIncome" className="text-sm font-medium text-gray-700">
                  Monthly Income (KES)
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="text-gray-500">ⓘ</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Your average monthly income before deductions.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="monthlyIncome"
                type="number"
                value={data.monthlyIncome}
                onChange={(e) => handleInputChange("monthlyIncome", Number(e.target.value))}
                className={`mt-1 bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-150 ${
                  errors.monthlyIncome ? "border-red-500" : ""
                }`}
                placeholder="50,000"
              />
              {errors.monthlyIncome && (
                <p className="text-xs text-red-500 mt-1">{errors.monthlyIncome}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Your average monthly income</p>
            </motion.div>
          )}

          {data.incomeType === "seasonal" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap泡-2">
                    <Label htmlFor="seasonalIncome" className="text-sm font-medium text-gray-700">
                      Seasonal Income (KES)
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <span className="text-gray-500">ⓘ</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Your average income per season.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="seasonalIncome"
                    type="number"
                    value={data.seasonalIncome || 0}
                    onChange={(e) => handleInputChange("seasonalIncome", Number(e.target.value))}
                    className={`mt-1 bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-150 ${
                      errors.seasonalIncome ? "border-red-500" : ""
                    }`}
                    placeholder="100,000"
                  />
                  {errors.seasonalIncome && (
                    <p className="text-xs text-red-500 mt-1">{errors.seasonalIncome}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Your average seasonal income</p>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="seasonsPerYear" className="text-sm font-medium text-gray-700">
                      Seasons per Year
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <span className="text-gray-500">ⓘ</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Number of income-generating seasons per year.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="seasonsPerYear"
                    type="number"
                    value={data.seasonsPerYear || 1}
                    onChange={(e) => handleInputChange("seasonsPerYear", Number(e.target.value))}
                    className={`mt-1 bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-150 ${
                      errors.seasonsPerYear ? "border-red-500" : ""
                    }`}
                    placeholder="4"
                    min="1"
                    max="12"
                  />
                  {errors.seasonsPerYear && (
                    <p className="text-xs text-red-500 mt-1">{errors.seasonsPerYear}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Number of seasons per year</p>
                </div>
              </div>
            </motion.div>
          )}

          {data.incomeType === "random" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="averageGigIncome" className="text-sm font-medium text-gray-700">
                      Average Gig Income (KES)
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <span className="text-gray-500">ⓘ</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Your average income per gig or project.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="averageGigIncome"
                    type="number"
                    value={data.averageGigIncome || 0}
                    onChange={(e) => handleInputChange("averageGigIncome", Number(e.target.value))}
                    className={`mt-1 bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-150 ${
                      errors.averageGigIncome ? "border-red-500" : ""
                    }`}
                    placeholder="20,000"
                  />
                  {errors.averageGigIncome && (
                    <p className="text-xs text-red-500 mt-1">{errors.averageGigIncome}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Your average income per gig</p>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="gigsPerYear" className="text-sm font-medium text-gray-700">
                      Gigs per Year
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <span className="text-gray-500">ⓘ</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Number of gigs or projects per year.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="gigsPerYear"
                    type="number"
                    value={data.gigsPerYear || 1}
                    onChange={(e) => handleInputChange("gigsPerYear", Number(e.target.value))}
                    className={`mt-1 bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-150 ${
                      errors.gigsPerYear ? "border-red-500" : ""
                    }`}
                    placeholder="12"
                    min="1"
                  />
                  {errors.gigsPerYear && (
                    <p className="text-xs text-red-500 mt-1">{errors.gigsPerYear}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Number of gigs per year</p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Label htmlFor="currentAge" className="text-sm font-medium text-gray-700">
                  Current Age
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="text-gray-500">ⓘ</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Your current age.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="currentAge"
                type="number"
                value={data.currentAge}
                onChange={(e) => handleInputChange("currentAge", Number(e.target.value))}
                className={`mt-1 bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-150 ${
                  errors.currentAge ? "border-red-500" : ""
                }`}
                min="18"
                max="65"
              />
              {errors.currentAge && (
                <p className="text-xs text-red-500 mt-1">{errors.currentAge}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Your current age</p>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Label htmlFor="retirementAge" className="text-sm font-medium text-gray-700">
                  Retirement Age
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="text-gray-500">ⓘ</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Your planned retirement age.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="retirementAge"
                type="number"
                value={data.retirementAge}
                onChange={(e) => handleInputChange("retirementAge", Number(e.target.value))}
                className={`mt-1 bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-150 ${
                  errors.retirementAge ? "border-red-500" : ""
                }`}
                min="50"
                max="70"
              />
              {errors.retirementAge && (
                <p className="text-xs text-red-500 mt-1">{errors.retirementAge}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Your planned retirement age</p>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <Label htmlFor="monthlyExpenses" className="text-sm font-medium text-gray-700">
                Monthly Expenses (KES)
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <span className="text-gray-500">ⓘ</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Your current monthly living expenses.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="monthlyExpenses"
              type="number"
              value={data.monthlyExpenses}
              onChange={(e) => handleInputChange("monthlyExpenses", Number(e.target.value))}
              className={`mt-1 bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-150 ${
                errors.monthlyExpenses ? "border-red-500" : ""
              }`}
              placeholder="30,000"
            />
            {errors.monthlyExpenses && (
              <p className="text-xs text-red-500 mt-1">{errors.monthlyExpenses}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">Your current monthly living expenses</p>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <Label htmlFor="contributionPercentage" className="text-sm font-medium text-gray-700">
                Contribution Percentage (%)
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <span className="text-gray-500">ⓘ</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Percentage of income to save for retirement.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="contributionPercentage"
              type="number"
              value={data.contributionPercentage}
              onChange={(e) => handleInputChange("contributionPercentage", Number(e.target.value))}
              className={`mt-1 bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-150 ${
                errors.contributionPercentage ? "border-red-500" : ""
              }`}
              min="5"
              max="50"
              placeholder="15"
            />
            {errors.contributionPercentage && (
              <p className="text-xs text-red-500 mt-1">{errors.contributionPercentage}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">Percentage of income to save for retirement</p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="pt-4"
          >
            <p className="text-sm font-medium text-gray-700">
              Estimated Retirement Savings:{" "}
              <span className="text-blue-600">KES {estimatedSavings.toLocaleString()}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Based on current inputs (simplified calculation)
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};