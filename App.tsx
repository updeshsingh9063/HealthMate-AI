import React, { useState, useMemo, useCallback } from 'react';
import { getHealthAnalysis } from './services/geminiService';
import type { FormData, HealthAnalysis } from './types';
import { Step } from './types';
import StepIndicator from './components/StepIndicator';
import Step1Profile from './components/Step1Profile';
import Step2Labs from './components/Step2Labs';
import Step3Symptoms from './components/Step3Symptoms';
import Step4Results from './components/Step4Results';
import { AlertTriangle, BotMessageSquare } from 'lucide-react';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.Profile);
  const [formData, setFormData] = useState<FormData>({
    profile: { age: '', height: '', weight: '', sex: 'male' },
    labResults: {
      hemoglobin: '',
      glucose: '',
      tsh: '',
      systolicBP: '',
      diastolicBP: '',
    },
    symptoms: '',
  });
  const [analysis, setAnalysis] = useState<HealthAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateFormData = <K extends 'profile' | 'labResults'>(
    section: K,
    data: Partial<FormData[K]>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }));
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, Step.Results));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, Step.Profile));
  };
  
  const handleReset = () => {
    setCurrentStep(Step.Profile);
    setFormData({
        profile: { age: '', height: '', weight: '', sex: 'male' },
        labResults: {
            hemoglobin: '',
            glucose: '',
            tsh: '',
            systolicBP: '',
            diastolicBP: '',
        },
        symptoms: '',
    });
    setAnalysis(null);
    setError(null);
    setIsLoading(false);
  }

  const bmi = useMemo(() => {
    const heightM = parseFloat(formData.profile.height) / 100;
    const weightKg = parseFloat(formData.profile.weight);
    if (heightM > 0 && weightKg > 0) {
      return (weightKg / (heightM * heightM)).toFixed(2);
    }
    return null;
  }, [formData.profile.height, formData.profile.weight]);

  const handleSubmit = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    setCurrentStep(Step.Results);

    try {
      const fullFormData = { ...formData, bmi: bmi || 'Not available' };
      const result = await getHealthAnalysis(fullFormData);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please check your API Key and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [formData, bmi]);

  const renderStep = () => {
    switch (currentStep) {
      case Step.Profile:
        return (
          <Step1Profile
            data={formData.profile}
            updateData={(data) => updateFormData('profile', data)}
            onNext={handleNext}
            bmi={bmi}
          />
        );
      case Step.Labs:
        return (
          <Step2Labs
            data={formData.labResults}
            updateData={(data) => updateFormData('labResults', data)}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case Step.Symptoms:
        return (
          <Step3Symptoms
            data={formData.symptoms}
            updateData={(symptoms) => setFormData(f => ({...f, symptoms}))}
            onSubmit={handleSubmit}
            onBack={handleBack}
          />
        );
      case Step.Results:
        return <Step4Results analysis={analysis} isLoading={isLoading} error={error} onReset={handleReset} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
        <header className="w-full max-w-4xl mb-6 text-center">
            <div className="flex items-center justify-center gap-3">
                <BotMessageSquare className="w-10 h-10 text-cyan-600"/>
                <h1 className="text-4xl font-bold text-slate-900">HealthMate AI</h1>
            </div>
            <p className="text-slate-600 mt-2">Predict, Prevent & Plan Your Wellness Journey</p>
        </header>

        <main className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <StepIndicator currentStep={currentStep} />
            <div className="mt-8">{renderStep()}</div>
        </main>

        <footer className="w-full max-w-4xl mt-8 text-center">
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md flex items-center justify-center gap-3">
                <AlertTriangle className="h-6 w-6"/>
                <p className="text-sm">
                    <strong>Disclaimer:</strong> HealthMate AI provides information for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                </p>
            </div>
            <p className="text-xs text-slate-400 mt-4">Powered by Google Gemini</p>
        </footer>
    </div>
  );
};

export default App;