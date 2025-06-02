import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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

  // Validate results data
  const isValidResults = results.projectedCorpus >= 0 && results.requiredCorpus > 0 && results.monthlyContribution >= 0;
  const fundingGapPercentage = isValidResults
    ? Math.min(100, Math.max(0, (results.fundingGap / results.requiredCorpus) * 100))
    : 0;
  const isShortfall = isValidResults && results.fundingGap > 0;

  // Dynamic recommendation for shortfall
  const recommendedContribution = isValidResults && isShortfall
    ? results.monthlyContribution + results.fundingGap / (results.yearsToRetirement * 12)
    : results.monthlyContribution;

  return (
    <div className="animate-fade-in">
      <Card className="bg-gradient-to-br from-white to-gray-50 backdrop-blur-md border-0 shadow-lg hover:shadow-xl transition-shadow duration-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <span className="text-green-600 animate-scale-in">🎯</span>
            Retirement Projection Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isValidResults ? (
            <div className="text-red-600 text-sm p-4">Invalid or incomplete results data. Please check your inputs.</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Column - Key Numbers */}
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-blue-50 rounded-lg p-4"
                >
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-blue-600 font-medium">Projected Corpus</div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <span className="text-gray-500">ⓘ</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Estimated savings at retirement based on current contributions.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="text-2xl font-bold text-blue-800">
                    {formatCurrency(results.projectedCorpus)}
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    At retirement ({results.yearsToRetirement} years)
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-purple-50 rounded-lg p-4"
                >
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-purple-600 font-medium">Required Corpus</div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <span className="text-gray-500">ⓘ</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Amount needed for a comfortable retirement.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="text-2xl font-bold text-purple-800">
                    {formatCurrency(results.requiredCorpus)}
                  </div>
                  <div className="text-xs text-purple-600 mt-1">
                    For comfortable retirement
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-gray-50 rounded-lg p-4"
                >
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-gray-600 font-medium">Monthly Contribution</div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <span className="text-gray-500">ⓘ</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Your current monthly contribution to retirement savings.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="text-xl font-bold text-gray-800">
                    {formatCurrency(results.monthlyContribution)}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Current contribution amount
                  </div>
                </motion.div>
              </div>

              {/* Right Column - Gap Analysis */}
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className={`${isShortfall ? 'bg-red-50' : 'bg-green-50'} rounded-lg p-4`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`text-sm font-medium ${isShortfall ? 'text-red-600' : 'text-green-600'}`}>
                      {isShortfall ? 'Funding Shortfall' : 'Surplus'}
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <span className="text-gray-500">ⓘ</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {isShortfall
                              ? 'The amount by which your projected savings fall short of the required amount.'
                              : 'The amount by which your projected savings exceed the required amount.'}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className={`text-2xl font-bold ${isShortfall ? 'text-red-800' : 'text-green-800'}`}>
                    {formatCurrency(Math.abs(results.fundingGap))}
                  </div>
                  <div className={`text-xs mt-1 ${isShortfall ? 'text-red-600' : 'text-green-600'}`}>
                    {isShortfall ? `${fundingGapPercentage.toFixed(1)}% below target` : 'Above target!'}
                  </div>
                </motion.div>

                {isShortfall && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-orange-50 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-orange-600 font-medium">💡 Recommendation</div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="text-gray-500">ⓘ</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Suggested monthly contribution to close the funding gap.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="text-xs text-orange-700 mt-1">
                      Consider increasing your contribution to{" "}
                      <span className="font-medium">{formatCurrency(recommendedContribution)}</span>{" "}
                      per month to meet your retirement goal.
                    </div>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-gray-100 rounded-lg p-4"
                >
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-gray-600 font-medium mb-2">Goal Achievement</div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <span className="text-gray-500">ⓘ</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Percentage of the required corpus you are projected to achieve.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <motion.div
                      className={`h-3 rounded-full ${isShortfall ? 'bg-red-500' : 'bg-green-500'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${fundingGapPercentage}%` }}
                      transition={{ duration: 0.5 }}
                    ></motion.div>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {fundingGapPercentage.toFixed(1)}% of target
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
