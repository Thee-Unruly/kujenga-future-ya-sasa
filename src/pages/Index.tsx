
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
      <header className="bg-white/80 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PensionSim Kenya
              </h1>
              <p className="text-gray-600 mt-1">Retirement planning for the self-employed</p>
            </div>
            <div className="hidden md:flex items-center space-x-4 text-sm text-gray-500">
              <span>🇰🇪 Kenya</span>
              <span>📱 Mobile-first</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Input Forms */}
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

          {/* Right Column - Results */}
          <div className="lg:col-span-2 space-y-6">
            {results && (
              <>
                <ResultsSummary results={results} />
                <DashboardCharts results={results} pensionData={pensionData} />
              </>
            )}
            
            {!results && (
              <div className="bg-white rounded-xl p-8 shadow-sm border text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Your Pension Projection
                </h3>
                <p className="text-gray-500">
                  Fill in your income details to see your retirement projections
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Information Footer */}
        <div className="mt-12 bg-white/60 rounded-xl p-6 backdrop-blur-sm">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">💡</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Smart Recommendations</h4>
              <p className="text-sm text-gray-600">
                Get contribution suggestions based on your income patterns and goals
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-bold">📈</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Scenario Modeling</h4>
              <p className="text-sm text-gray-600">
                Monte Carlo simulations with inflation and investment return scenarios
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold">🎯</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Gap Analysis</h4>
              <p className="text-sm text-gray-600">
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
