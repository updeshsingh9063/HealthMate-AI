
import React from 'react';
import { Step } from '../types';
import { User, Beaker, Stethoscope, FileText } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: Step;
}

const stepsConfig = [
  { id: Step.Profile, label: 'Profile', icon: User },
  { id: Step.Labs, label: 'Lab Reports', icon: Beaker },
  { id: Step.Symptoms, label: 'Symptoms', icon: Stethoscope },
  { id: Step.Results, label: 'Results', icon: FileText },
];

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="flex items-center justify-between w-full max-w-2xl mx-auto">
      {stepsConfig.map((step, index) => {
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;
        const Icon = step.icon;

        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center text-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                  ${isActive ? 'bg-cyan-600 text-white shadow-lg scale-110' : ''}
                  ${isCompleted ? 'bg-cyan-500 text-white' : ''}
                  ${!isActive && !isCompleted ? 'bg-slate-200 text-slate-500' : ''}
                `}
              >
                <Icon className="w-6 h-6" />
              </div>
              <p
                className={`mt-2 text-xs sm:text-sm font-semibold transition-colors duration-300
                  ${isActive ? 'text-cyan-700' : ''}
                  ${isCompleted ? 'text-slate-700' : ''}
                  ${!isActive && !isCompleted ? 'text-slate-500' : ''}
                `}
              >
                {step.label}
              </p>
            </div>
            {index < stepsConfig.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 sm:mx-4 transition-colors duration-500
                  ${isCompleted ? 'bg-cyan-500' : 'bg-slate-200'}
                `}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepIndicator;
