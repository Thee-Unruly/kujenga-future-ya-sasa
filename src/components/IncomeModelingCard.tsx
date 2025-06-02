
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PensionData } from "@/types/pension";

interface IncomeModelingCardProps {
  data: PensionData;
  onUpdate: (data: Partial<PensionData>) => void;
}

export const IncomeModelingCard = ({ data, onUpdate }: IncomeModelingCardProps) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="text-blue-600">💰</span>
          Income Modeling
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="incomeType" className="text-sm font-medium text-gray-700">
            Income Pattern
          </Label>
          <Select 
            value={data.incomeType} 
            onValueChange={(value: 'monthly' | 'seasonal' | 'random') => 
              onUpdate({ incomeType: value })
            }
          >
            <SelectTrigger className="mt-1 bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="monthly">Monthly (Stable)</SelectItem>
              <SelectItem value="seasonal">Seasonal (Variable)</SelectItem>
              <SelectItem value="random">Irregular (Gig work)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-1">
            Choose your typical income pattern
          </p>
        </div>

        {data.incomeType === 'monthly' && (
          <div>
            <Label htmlFor="monthlyIncome" className="text-sm font-medium text-gray-700">
              Monthly Income (KES)
            </Label>
            <Input
              id="monthlyIncome"
              type="number"
              value={data.monthlyIncome}
              onChange={(e) => onUpdate({ monthlyIncome: Number(e.target.value) })}
              className="mt-1 bg-white"
              placeholder="50,000"
            />
            <p className="text-xs text-gray-500 mt-1">
              Your average monthly income
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="currentAge" className="text-sm font-medium text-gray-700">
              Current Age
            </Label>
            <Input
              id="currentAge"
              type="number"
              value={data.currentAge}
              onChange={(e) => onUpdate({ currentAge: Number(e.target.value) })}
              className="mt-1 bg-white"
              min="18"
              max="65"
            />
          </div>
          <div>
            <Label htmlFor="retirementAge" className="text-sm font-medium text-gray-700">
              Retirement Age
            </Label>
            <Input
              id="retirementAge"
              type="number"
              value={data.retirementAge}
              onChange={(e) => onUpdate({ retirementAge: Number(e.target.value) })}
              className="mt-1 bg-white"
              min="50"
              max="70"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="monthlyExpenses" className="text-sm font-medium text-gray-700">
            Monthly Expenses (KES)
          </Label>
          <Input
            id="monthlyExpenses"
            type="number"
            value={data.monthlyExpenses}
            onChange={(e) => onUpdate({ monthlyExpenses: Number(e.target.value) })}
            className="mt-1 bg-white"
            placeholder="30,000"
          />
          <p className="text-xs text-gray-500 mt-1">
            Your current monthly living expenses
          </p>
        </div>

        <div>
          <Label htmlFor="contributionPercentage" className="text-sm font-medium text-gray-700">
            Contribution Percentage (%)
          </Label>
          <Input
            id="contributionPercentage"
            type="number"
            value={data.contributionPercentage}
            onChange={(e) => onUpdate({ contributionPercentage: Number(e.target.value) })}
            className="mt-1 bg-white"
            min="5"
            max="50"
            placeholder="15"
          />
          <p className="text-xs text-gray-500 mt-1">
            Percentage of income to save for retirement
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
