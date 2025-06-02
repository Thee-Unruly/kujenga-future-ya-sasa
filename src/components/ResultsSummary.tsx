
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PensionResults } from "@/types/pension";

interface ResultsSummaryProps {
  results: PensionResults;
}

export const ResultsSummary = ({ results }: ResultsSummaryProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const fundingGapPercentage = ((results.fundingGap / results.requiredCorpus) * 100);
  const isShortfall = results.fundingGap > 0;

  return (
    <Card className="bg-white border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <span className="text-green-600">🎯</span>
          Retirement Projection Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column - Key Numbers */}
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm text-blue-600 font-medium">Projected Corpus</div>
              <div className="text-2xl font-bold text-blue-800">
                {formatCurrency(results.projectedCorpus)}
              </div>
              <div className="text-xs text-blue-600 mt-1">
                At retirement ({results.yearsToRetirement} years)
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-sm text-purple-600 font-medium">Required Corpus</div>
              <div className="text-2xl font-bold text-purple-800">
                {formatCurrency(results.requiredCorpus)}
              </div>
              <div className="text-xs text-purple-600 mt-1">
                For comfortable retirement
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 font-medium">Monthly Contribution</div>
              <div className="text-xl font-bold text-gray-800">
                {formatCurrency(results.monthlyContribution)}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Current contribution amount
              </div>
            </div>
          </div>

          {/* Right Column - Gap Analysis */}
          <div className="space-y-4">
            <div className={`${isShortfall ? 'bg-red-50' : 'bg-green-50'} rounded-lg p-4`}>
              <div className={`text-sm font-medium ${isShortfall ? 'text-red-600' : 'text-green-600'}`}>
                {isShortfall ? 'Funding Shortfall' : 'Surplus'}
              </div>
              <div className={`text-2xl font-bold ${isShortfall ? 'text-red-800' : 'text-green-800'}`}>
                {formatCurrency(Math.abs(results.fundingGap))}
              </div>
              <div className={`text-xs mt-1 ${isShortfall ? 'text-red-600' : 'text-green-600'}`}>
                {isShortfall ? `${fundingGapPercentage.toFixed(1)}% below target` : 'Above target!'}
              </div>
            </div>

            {isShortfall && (
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-sm text-orange-600 font-medium">💡 Recommendation</div>
                <div className="text-xs text-orange-700 mt-1">
                  Consider increasing your contribution to{" "}
                  <span className="font-medium">
                    {formatCurrency(results.monthlyContribution * 1.3)}
                  </span>{" "}
                  per month to meet your retirement goal.
                </div>
              </div>
            )}

            {/* Progress Bar */}
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="text-sm text-gray-600 font-medium mb-2">Goal Achievement</div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${isShortfall ? 'bg-red-500' : 'bg-green-500'}`}
                  style={{ 
                    width: `${Math.min(100, (results.projectedCorpus / results.requiredCorpus) * 100)}%` 
                  }}
                ></div>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {((results.projectedCorpus / results.requiredCorpus) * 100).toFixed(1)}% of target
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
