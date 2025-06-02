
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PensionData } from "@/types/pension";

interface ScenarioSimulationProps {
  data: PensionData;
  onUpdate: (data: Partial<PensionData>) => void;
}

export const ScenarioSimulation = ({ data, onUpdate }: ScenarioSimulationProps) => {
  const riskProfiles = {
    low: { return: '6-8%', description: 'Government bonds, fixed deposits' },
    medium: { return: '8-12%', description: 'Balanced funds, NSSF schemes' },
    high: { return: '12-15%', description: 'Equity funds, stocks' }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="text-purple-600">📊</span>
          Investment Scenarios
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="investmentRisk" className="text-sm font-medium text-gray-700">
            Investment Risk Profile
          </Label>
          <Select 
            value={data.investmentRisk} 
            onValueChange={(value: 'low' | 'medium' | 'high') => 
              onUpdate({ investmentRisk: value })
            }
          >
            <SelectTrigger className="mt-1 bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="low">
                <div>
                  <div className="font-medium">Conservative</div>
                  <div className="text-xs text-gray-500">Expected: {riskProfiles.low.return}</div>
                </div>
              </SelectItem>
              <SelectItem value="medium">
                <div>
                  <div className="font-medium">Balanced</div>
                  <div className="text-xs text-gray-500">Expected: {riskProfiles.medium.return}</div>
                </div>
              </SelectItem>
              <SelectItem value="high">
                <div>
                  <div className="font-medium">Aggressive</div>
                  <div className="text-xs text-gray-500">Expected: {riskProfiles.high.return}</div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-1">
            {riskProfiles[data.investmentRisk].description}
          </p>
        </div>

        {/* Economic Assumptions */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <h4 className="font-medium text-gray-800 text-sm">Economic Assumptions</h4>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-gray-600">Inflation Rate:</span>
              <span className="font-medium ml-1">5.5%</span>
            </div>
            <div>
              <span className="text-gray-600">Life Expectancy:</span>
              <span className="font-medium ml-1">75 years</span>
            </div>
            <div>
              <span className="text-gray-600">Salary Growth:</span>
              <span className="font-medium ml-1">3%</span>
            </div>
            <div>
              <span className="text-gray-600">Post-retirement:</span>
              <span className="font-medium ml-1">80% of expenses</span>
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 text-sm mb-2">💡 Smart Tip</h4>
          <p className="text-xs text-blue-700">
            Starting early gives you more time for compound growth. Even small, 
            consistent contributions can build substantial retirement funds over time.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
