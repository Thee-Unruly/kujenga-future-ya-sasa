
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PensionData } from "@/types/pension";

interface IncomeModelingCardProps {
  data: PensionData;
  onUpdate: (newData: Partial<PensionData>) => void;
}

export const IncomeModelingCard = ({ data, onUpdate }: IncomeModelingCardProps) => {
  const [gigIncomes, setGigIncomes] = useState(data.gigIncomes || []);
  const [seasonalIncomes, setSeasonalIncomes] = useState(data.seasonalIncomes || []);

  const handleIncomeTypeChange = (newType: string) => {
    onUpdate({ incomeType: newType as 'monthly' | 'seasonal' | 'random' });
  };

  const addGigIncome = () => {
    const newGig = {
      id: Date.now().toString(),
      amount: 0,
      frequencyPerYear: 1
    };
    const updatedGigs = [...gigIncomes, newGig];
    setGigIncomes(updatedGigs);
    onUpdate({ gigIncomes: updatedGigs });
  };

  const updateGigIncome = (id: string, field: string, value: number) => {
    const updatedGigs = gigIncomes.map(gig =>
      gig.id === id ? { ...gig, [field]: value } : gig
    );
    setGigIncomes(updatedGigs);
    onUpdate({ gigIncomes: updatedGigs });
  };

  const removeGigIncome = (id: string) => {
    const updatedGigs = gigIncomes.filter(gig => gig.id !== id);
    setGigIncomes(updatedGigs);
    onUpdate({ gigIncomes: updatedGigs });
  };

  const addSeasonalIncome = () => {
    const newSeasonal = {
      month: 'January' as const,
      amount: 0
    };
    const updatedSeasonal = [...seasonalIncomes, newSeasonal];
    setSeasonalIncomes(updatedSeasonal);
    onUpdate({ seasonalIncomes: updatedSeasonal });
  };

  const updateSeasonalIncome = (index: number, field: string, value: any) => {
    const updatedSeasonal = seasonalIncomes.map((income, i) =>
      i === index ? { ...income, [field]: value } : income
    );
    setSeasonalIncomes(updatedSeasonal);
    onUpdate({ seasonalIncomes: updatedSeasonal });
  };

  const removeSeasonalIncome = (index: number) => {
    const updatedSeasonal = seasonalIncomes.filter((_, i) => i !== index);
    setSeasonalIncomes(updatedSeasonal);
    onUpdate({ seasonalIncomes: updatedSeasonal });
  };

  return (
    <div className="animate-fade-in">
      <Card className="bg-gradient-to-br from-white to-gray-50 backdrop-blur-md border-0 shadow-lg hover:shadow-xl transition-shadow duration-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <span className="text-blue-600 animate-scale-in">💰</span>
            Income Modeling
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Income Type Selection */}
          <div>
            <div className="flex items-center gap-2">
              <Label htmlFor="incomeType" className="text-sm font-medium text-gray-700">
                Income Type
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <span className="text-gray-500">ⓘ</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Choose the pattern that best describes your income flow.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select value={data.incomeType} onValueChange={handleIncomeTypeChange}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select income type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly (Fixed salary)</SelectItem>
                <SelectItem value="seasonal">Seasonal (Farming, tourism)</SelectItem>
                <SelectItem value="random">Random (Gig work, freelance)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Monthly Income */}
          {data.incomeType === 'monthly' && (
            <div>
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
                      <p>Your consistent monthly salary or income.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="monthlyIncome"
                type="number"
                value={data.monthlyIncome || ''}
                onChange={(e) => onUpdate({ monthlyIncome: Number(e.target.value) })}
                placeholder="50000"
                className="mt-1"
              />
            </div>
          )}

          {/* Seasonal Income */}
          {data.incomeType === 'seasonal' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Seasonal Income Periods
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <span className="text-gray-500">ⓘ</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Add income for specific months when you earn.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Button onClick={addSeasonalIncome} size="sm" variant="outline">
                  Add Period
                </Button>
              </div>
              
              {seasonalIncomes.map((income, index) => (
                <div key={index} className="grid grid-cols-3 gap-2 items-center">
                  <Select
                    value={income.month}
                    onValueChange={(value) => updateSeasonalIncome(index, 'month', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'].map(month => (
                        <SelectItem key={month} value={month}>{month}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    value={income.amount}
                    onChange={(e) => updateSeasonalIncome(index, 'amount', Number(e.target.value))}
                    placeholder="Amount"
                  />
                  <Button
                    onClick={() => removeSeasonalIncome(index)}
                    size="sm"
                    variant="destructive"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Random/Gig Income */}
          {data.incomeType === 'random' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Gig Income Sources
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <span className="text-gray-500">ⓘ</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Add different types of gigs and their frequency.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Button onClick={addGigIncome} size="sm" variant="outline">
                  Add Gig
                </Button>
              </div>
              
              {gigIncomes.map((gig) => (
                <div key={gig.id} className="grid grid-cols-4 gap-2 items-center">
                  <Input
                    type="number"
                    value={gig.amount}
                    onChange={(e) => updateGigIncome(gig.id, 'amount', Number(e.target.value))}
                    placeholder="Amount per gig"
                  />
                  <Input
                    type="number"
                    value={gig.frequencyPerYear}
                    onChange={(e) => updateGigIncome(gig.id, 'frequencyPerYear', Number(e.target.value))}
                    placeholder="Times/year"
                  />
                  <span className="text-xs text-gray-500">
                    = {(gig.amount * gig.frequencyPerYear).toLocaleString('en-KE', {
                      style: 'currency',
                      currency: 'KES',
                      minimumFractionDigits: 0
                    })}/year
                  </span>
                  <Button
                    onClick={() => removeGigIncome(gig.id)}
                    size="sm"
                    variant="destructive"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Personal Details */}
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
                      <p>Your current age to calculate years until retirement.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="currentAge"
                type="number"
                value={data.currentAge}
                onChange={(e) => onUpdate({ currentAge: Number(e.target.value) })}
                min="18"
                max="80"
                className="mt-1"
              />
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
                      <p>The age when you plan to retire.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="retirementAge"
                type="number"
                value={data.retirementAge}
                onChange={(e) => onUpdate({ retirementAge: Number(e.target.value) })}
                min={data.currentAge}
                max="80"
                className="mt-1"
              />
            </div>
          </div>

          {/* Monthly Expenses */}
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
              onChange={(e) => onUpdate({ monthlyExpenses: Number(e.target.value) })}
              placeholder="30000"
              className="mt-1"
            />
          </div>

          {/* Contribution Percentage */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label className="text-sm font-medium text-gray-700">
                Contribution Percentage: {data.contributionPercentage}%
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
            <Slider
              value={[data.contributionPercentage]}
              onValueChange={(value) => onUpdate({ contributionPercentage: value[0] })}
              max={50}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1%</span>
              <span>50%</span>
            </div>
          </div>

          {/* Investment Risk */}
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
                    <p>Your comfort level with investment risk vs return.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select value={data.investmentRisk} onValueChange={(value) => onUpdate({ investmentRisk: value as 'low' | 'medium' | 'high' })}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low Risk (6-8% returns)</SelectItem>
                <SelectItem value="medium">Medium Risk (8-12% returns)</SelectItem>
                <SelectItem value="high">High Risk (12-15% returns)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
