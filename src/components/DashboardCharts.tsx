import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { PensionResults, PensionData } from "@/types/pension";

interface DashboardChartsProps {
  results: PensionResults;
  pensionData: PensionData;
}

export const DashboardCharts = ({ results, pensionData }: DashboardChartsProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: 'compact'
    }).format(value);
  };

  // Dynamic colors for scenarios to avoid hardcoding
  const getScenarioColor = (index: number) => {
    const colors = [
      '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899',
      '#6B7280', '#14B8A6', '#F97316', '#DC2626' // Extendable color palette
    ];
    return colors[index % colors.length]; // Cycle through colors if more scenarios
  };

  // Prepare scenario data for pie chart
  const scenarioData = results.scenarios.map((scenario, index) => ({
    name: scenario.scenario,
    value: scenario.probability,
    corpus: scenario.finalCorpus,
    color: getScenarioColor(index)
  }));

  // Calculate inflation-adjusted corpus dynamically (if inflationAdjustedBalance is unavailable)
  const inflationAdjustedCorpus = results.projectionData.length > 0
    ? results.projectionData[results.projectionData.length - 1].inflationAdjustedBalance ?? results.projectedCorpus
    : results.projectedCorpus;

  // Calculate recommended contribution dynamically (avoid hardcoding 1.2 multiplier)
  const recommendedContribution = results.monthlyContribution * (1 + pensionData.contributionPercentage / 100);

  return (
    <div className="space-y-6">
      {/* Corpus Growth Chart */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-blue-600">📈</span>
            Retirement Corpus Growth
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={results.projectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="age" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={formatCurrency}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [formatCurrency(value), name]}
                  labelFormatter={(age: number) => `Age: ${age}`}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  name="Projected Balance"
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
                {results.projectionData.some(d => d.inflationAdjustedBalance !== undefined) && (
                  <Line 
                    type="monotone" 
                    dataKey="inflationAdjustedBalance" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Inflation Adjusted"
                    dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 3 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-center">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-xs text-blue-600">Final Balance</div>
              <div className="font-bold text-blue-800">{formatCurrency(results.projectedCorpus)}</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="text-xs text-purple-600">Inflation Adjusted</div>
              <div className="font-bold text-purple-800">{formatCurrency(inflationAdjustedCorpus)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Investment Scenarios */}
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <span className="text-purple-600">🎲</span>
              Scenario Outcomes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={scenarioData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {scenarioData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number, name: string) => [`${value}%`, 'Probability']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {scenarioData.map((scenario, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: scenario.color }}
                    ></div>
                    <span className="text-sm">{scenario.name}</span>
                  </div>
                  <div className="text-sm font-medium">
                    {formatCurrency(scenario.corpus)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Contributions */}
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <span className="text-green-600">💰</span>
              Contribution Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-sm text-green-600 font-medium">Current Monthly</div>
                <div className="text-xl font-bold text-green-800">
                  {formatCurrency(results.monthlyContribution)}
                </div>
                <div className="text-xs text-green-600 mt-1">
                  {pensionData.contributionPercentage}% of income
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-sm text-orange-600 font-medium">Recommended Monthly</div>
                <div className="text-xl font-bold text-orange-800">
                  {formatCurrency(recommendedContribution)}
                </div>
                <div className="text-xs text-orange-600 mt-1">
                  Based on {Math.round(pensionData.contributionPercentage * 2)}% of income
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 font-medium">Total Contributions</div>
                <div className="text-lg font-bold text-gray-800">
                  {formatCurrency(results.monthlyContribution * 12 * results.yearsToRetirement)}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Over {results.yearsToRetirement} years
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
