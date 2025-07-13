
import React from 'react';
import type { HealthAnalysis, PotentialCondition } from '../types';
import { Dna, Soup, HeartPulse, Stethoscope, AlertCircle, RefreshCw, RotateCw, Download } from 'lucide-react';

interface Props {
  analysis: HealthAnalysis | null;
  isLoading: boolean;
  error: string | null;
  onReset: () => void;
}

const LoadingState: React.FC = () => (
  <div className="text-center py-16 animate-fade-in">
    <div className="flex justify-center items-center mb-4">
      <Dna className="w-16 h-16 text-cyan-500 animate-spin-slow" />
    </div>
    <h2 className="text-2xl font-semibold text-slate-700">Analyzing Your Data...</h2>
    <p className="text-slate-500 mt-2">Our AI is processing your information to generate personalized insights. This may take a moment.</p>
  </div>
);

const ErrorState: React.FC<{ message: string; onRetry: () => void; }> = ({ message, onRetry }) => (
  <div className="text-center py-16 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
    <div className="flex justify-center items-center mb-4">
      <AlertCircle className="w-12 h-12 text-red-500" />
    </div>
    <h2 className="text-2xl font-semibold text-red-700">Analysis Failed</h2>
    <p className="text-red-600 mt-2 max-w-md mx-auto">{message}</p>
    <button
        onClick={onRetry}
        className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Start Over
    </button>
  </div>
);

const ResultCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-white rounded-lg shadow p-6 border border-slate-200">
        <div className="flex items-center mb-4">
            {icon}
            <h3 className="ml-3 text-xl font-semibold text-slate-800">{title}</h3>
        </div>
        {children}
    </div>
);

const ConfidenceBadge: React.FC<{ level: 'Low' | 'Medium' | 'High' }> = ({ level }) => {
    const styles = {
        Low: 'bg-blue-100 text-blue-800',
        Medium: 'bg-yellow-100 text-yellow-800',
        High: 'bg-red-100 text-red-800',
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[level]}`}>{level} Confidence</span>;
};

const Step4Results: React.FC<Props> = ({ analysis, isLoading, error, onReset }) => {
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={onReset} />;
  if (!analysis) return null;

  const handleDownload = () => {
    if (!analysis) return;

    const reportHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>HealthMate AI Report</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 2rem; background-color: #fff; }
          h1, h2, h3, h4 { color: #111; margin-bottom: 0.5em; }
          h1 { font-size: 2.5em; text-align: center; border-bottom: 2px solid #eee; padding-bottom: 0.5em; margin-bottom: 1em; color: #0891b2; }
          h2 { font-size: 1.8em; border-bottom: 1px solid #eee; padding-bottom: 0.3em; margin-top: 2em; color: #0e7490; }
          h3 { font-size: 1.3em; color: #155e75; }
          ul { padding-left: 20px; }
          li { margin-bottom: 0.5em; }
          .disclaimer { background-color: #fffbe6; border: 1px solid #fde68a; padding: 1em; border-radius: 8px; margin-bottom: 2em; }
          .section { margin-bottom: 2em; }
          .condition { background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 1em; border-radius: 8px; margin-bottom: 1em; }
          .condition-header { display: flex; justify-content: space-between; align-items: center; }
          .confidence-badge { padding: 0.2em 0.6em; border-radius: 9999px; font-size: 0.8em; font-weight: 500; white-space: nowrap; }
          .confidence-Low { background-color: #dbeafe; color: #1e40af; }
          .confidence-Medium { background-color: #fef9c3; color: #854d0e; }
          .confidence-High { background-color: #fee2e2; color: #991b1b; }
          .next-steps { background-color: #ecfeff; border-left: 4px solid #0891b2; padding: 1em; margin-top: 2em; }
          .print-button { margin-top: 2rem; padding: 0.8em 1.5em; font-size: 1em; cursor: pointer; background-color: #0891b2; color: white; border: none; border-radius: 5px; }
          @media print {
            body { margin: 1in; padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <h1>HealthMate AI Report</h1>
        <div class="disclaimer">
          <strong>Disclaimer:</strong> This report is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.
        </div>
        <div class="section">
          <h2>Potential Conditions</h2>
          ${analysis.potentialConditions.map(item => `
            <div class="condition">
              <div class="condition-header">
                <h3>${item.condition}</h3>
                <span class="confidence-badge confidence-${item.confidence}">${item.confidence} Confidence</span>
              </div>
              <p>${item.explanation}</p>
            </div>
          `).join('')}
        </div>
        <div class="section">
          <h2>Dietary Suggestions</h2>
          <h3>General Advice</h3>
          <ul>${analysis.dietarySuggestions.generalAdvice.map(advice => `<li>${advice}</li>`).join('')}</ul>
          <h3>Meal Plan</h3>
            ${(Object.keys(analysis.dietarySuggestions.mealPlan) as (keyof typeof analysis.dietarySuggestions.mealPlan)[]).map(mealType => `
              <h4>${mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h4>
              <ul>${analysis.dietarySuggestions.mealPlan[mealType].map(food => `<li>${food}</li>`).join('')}</ul>
            `).join('')}
        </div>
        <div class="section">
          <h2>Lifestyle Recommendations</h2>
          <ul>${analysis.lifestyleRecommendations.map(rec => `<li>${rec}</li>`).join('')}</ul>
        </div>
        <div class="next-steps">
          <h3>Next Steps</h3>
          <p>Based on this analysis, it is recommended to consult with a <strong>${analysis.specialistRecommendation}</strong> for a comprehensive evaluation and formal diagnosis.</p>
        </div>
        <div class="no-print" style="text-align: center;">
            <button class="print-button" onclick="window.print()">Print or Save as PDF</button>
        </div>
      </body>
      </html>
    `;

    const reportWindow = window.open('', '_blank');
    if (reportWindow) {
      reportWindow.document.write(reportHtml);
      reportWindow.document.close();
      reportWindow.focus(); // Focus on the new tab
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
        <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900">Your Health Insights</h2>
            <p className="mt-2 text-slate-600">Here's a summary based on the information you provided.</p>
        </div>

      <ResultCard title="Potential Conditions" icon={<Stethoscope className="w-7 h-7 text-cyan-600" />}>
        <div className="space-y-4">
          {analysis.potentialConditions.map((item, index) => (
            <div key={index} className="p-4 rounded-md bg-slate-50 border border-slate-200">
              <div className="flex justify-between items-start">
                  <h4 className="font-bold text-slate-800">{item.condition}</h4>
                  <ConfidenceBadge level={item.confidence} />
              </div>
              <p className="mt-1 text-sm text-slate-600">{item.explanation}</p>
            </div>
          ))}
        </div>
      </ResultCard>

      <ResultCard title="Dietary Suggestions" icon={<Soup className="w-7 h-7 text-green-600" />}>
        <div className="space-y-4">
            <div>
                <h4 className="font-semibold text-slate-700">General Advice</h4>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-slate-600">
                    {analysis.dietarySuggestions.generalAdvice.map((advice, i) => <li key={i}>{advice}</li>)}
                </ul>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {(Object.keys(analysis.dietarySuggestions.mealPlan) as (keyof typeof analysis.dietarySuggestions.mealPlan)[]).map(mealType => (
                    <div key={mealType}>
                        <h5 className="font-semibold text-slate-700 capitalize">{mealType}</h5>
                        <ul className="list-disc list-inside mt-1 space-y-1 text-slate-600">
                            {analysis.dietarySuggestions.mealPlan[mealType].map((food, i) => <li key={i}>{food}</li>)}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
      </ResultCard>

      <ResultCard title="Lifestyle Recommendations" icon={<HeartPulse className="w-7 h-7 text-rose-500" />}>
        <ul className="list-disc list-inside space-y-2 text-slate-600">
          {analysis.lifestyleRecommendations.map((rec, index) => <li key={index}>{rec}</li>)}
        </ul>
      </ResultCard>

      <div className="p-6 bg-cyan-50 border-l-4 border-cyan-500 rounded-r-lg">
          <h3 className="font-bold text-cyan-800">Next Steps: Consult a Professional</h3>
          <p className="mt-2 text-cyan-700">
              Based on this analysis, it is recommended to consult with a <strong>{analysis.specialistRecommendation}</strong> for a comprehensive evaluation and formal diagnosis. Please share these results with your healthcare provider.
          </p>
      </div>

       <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
                onClick={onReset}
                className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            >
                <RotateCw className="mr-2 -ml-1 h-5 w-5" />
                Start a New Analysis
            </button>
            <button
                onClick={handleDownload}
                className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 border border-slate-300 text-base font-medium rounded-md shadow-sm text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            >
                <Download className="mr-2 -ml-1 h-5 w-5" />
                Download Full Report
            </button>
        </div>
    </div>
  );
};

export default Step4Results;
