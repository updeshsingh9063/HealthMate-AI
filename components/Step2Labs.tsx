
import React from 'react';
import type { LabResultData } from '../types';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface Props {
  data: LabResultData;
  updateData: (data: Partial<LabResultData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const Step2Labs: React.FC<Props> = ({ data, updateData, onNext, onBack }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateData({ [e.target.name]: e.target.value });
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800 mb-1">Lab Report Values</h2>
      <p className="text-slate-500 mb-6">Enter any values you have from your recent lab reports. You can leave fields blank.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
        <div>
          <label htmlFor="glucose" className="block text-sm font-medium text-slate-700">Fasting Blood Glucose (mg/dL)</label>
          <input type="number" name="glucose" id="glucose" value={data.glucose} onChange={handleChange} placeholder="e.g., 90" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="hemoglobin" className="block text-sm font-medium text-slate-700">Hemoglobin (g/dL)</label>
          <input type="number" name="hemoglobin" id="hemoglobin" value={data.hemoglobin} onChange={handleChange} placeholder="e.g., 14" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="tsh" className="block text-sm font-medium text-slate-700">TSH (mIU/L)</label>
          <input type="number" name="tsh" id="tsh" step="0.01" value={data.tsh} onChange={handleChange} placeholder="e.g., 2.5" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm" />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="systolicBP" className="block text-sm font-medium text-slate-700">Systolic BP</label>
              <input type="number" name="systolicBP" id="systolicBP" value={data.systolicBP} onChange={handleChange} placeholder="e.g., 120" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="diastolicBP" className="block text-sm font-medium text-slate-700">Diastolic BP</label>
              <input type="number" name="diastolicBP" id="diastolicBP" value={data.diastolicBP} onChange={handleChange} placeholder="e.g., 80" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm" />
            </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button onClick={onBack} className="inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md shadow-sm text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
          <ChevronLeft className="mr-2 h-5 w-5" />
          Back
        </button>
        <button onClick={onNext} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
          Next: Symptoms
          <ChevronRight className="ml-2 -mr-1 h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Step2Labs;
