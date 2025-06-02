
import { useState } from "react";
import { IncomeModelingCard } from "@/components/IncomeModelingCard";
import { ScenarioSimulation } from "@/components/ScenarioSimulation";
import { DashboardCharts } from "@/components/DashboardCharts";
import { ResultsSummary } from "@/components/ResultsSummary";
import { PensionData } from "@/types/pension";

const Index = () => {
  const [pensionData, setPensionData] = useState<PensionData>({
    incomeType: 'monthly',
    monthlyIncome: 50000,
    seasonalIncomes: [],
    currentAge: 30,
    retirementAge: 60,
    monthlyExpenses: 30000,
    investmentRisk: 'medium',
    contributionPercentage: 15
  });

  const [results, setResults] = useState(null);

  const handleDataUpdate = (newData: Partial<PensionData>) => {
    const updatedData = { ...pensionData, ...newData };
    setPensionData(updatedData);
    
    // Trigger calculation when data changes
    import("@/utils/pensionCalculations").then(({ calculatePensionProjection }) => {
      const calculatedResults = calculatePensionProjection(updatedData);
      setResults(calculatedResults);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 lg:py-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PensionSim Kenya
              </h1>
              <p className="text-gray-600 mt-1 text-sm lg:text-base">Retirement planning for the self-employed</p>
            </div>
            <div className="hidden sm:flex items-center space-x-2 lg:space-x-4 text-xs lg:text-sm text-gray-500">
              <span className="flex items-center gap-1">🇰🇪 Kenya</span>
              <span className="flex items-center gap-1">📱 Mobile-first</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Input Forms - Full width on mobile, left column on desktop */}
          <div className="lg:col-span-1 space-y-6">
            <IncomeModelingCard 
              data={pensionData} 
              onUpdate={handleDataUpdate}
            />
            <ScenarioSimulation 
              data={pensionData} 
              onUpdate={handleDataUpdate}
            />
          </div>

          {/* Results - Full width on mobile, right columns on desktop */}
          <div className="lg:col-span-2 space-y-6">
            {results && (
              <>
                <ResultsSummary results={results} />
                <DashboardCharts results={results} pensionData={pensionData} />
              </>
            )}
            
            {!results && (
              <div className="bg-white rounded-xl p-6 lg:p-8 shadow-sm border text-center">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl lg:text-2xl">📊</span>
                </div>
                <h3 className="text-lg lg:text-xl font-semibold text-gray-700 mb-2">
                  Your Pension Projection
                </h3>
                <p className="text-gray-500 text-sm lg:text-base">
                  Fill in your income details to see your retirement projections
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Information Footer - Better mobile layout */}
        <div className="mt-8 lg:mt-12 bg-white/60 rounded-xl p-4 lg:p-6 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 text-center">
            <div className="p-4">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold text-lg lg:text-xl">💡</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2 text-sm lg:text-base">Smart Recommendations</h4>
              <p className="text-xs lg:text-sm text-gray-600">
                Get contribution suggestions based on your income patterns and goals
              </p>
            </div>
            <div className="p-4">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-bold text-lg lg:text-xl">📈</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2 text-sm lg:text-base">Scenario Modeling</h4>
              <p className="text-xs lg:text-sm text-gray-600">
                Monte Carlo simulations with inflation and investment return scenarios
              </p>
            </div>
            <div className="p-4">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold text-lg lg:text-xl">🎯</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2 text-sm lg:text-base">Gap Analysis</h4>
              <p className="text-xs lg:text-sm text-gray-600">
                Clear view of projected vs required corpus for your retirement goals
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
