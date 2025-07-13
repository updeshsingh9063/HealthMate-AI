
import React from 'react';
import { Sparkles, ChevronLeft } from 'lucide-react';

interface Props {
  data: string;
  updateData: (symptoms: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}

const Step3Symptoms: React.FC<Props> = ({ data, updateData, onSubmit, onBack }) => {
    
  const isFormValid = data.trim().length > 10;

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800 mb-1">How are you feeling?</h2>
      <p className="text-slate-500 mb-6">Describe your symptoms in your own words. Be as detailed as you can. For example: "I've been feeling constantly tired for the last two weeks, and I've noticed I'm more thirsty than usual."</p>
      
      <div>
        <label htmlFor="symptoms" className="block text-sm font-medium text-slate-700 sr-only">Symptoms</label>
        <textarea
          id="symptoms"
          name="symptoms"
          rows={6}
          value={data}
          onChange={(e) => updateData(e.target.value)}
          className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
          placeholder="Describe your symptoms here..."
        />
      </div>

      <div className="mt-8 flex justify-between items-center">
        <button onClick={onBack} className="inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md shadow-sm text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
           <ChevronLeft className="mr-2 h-5 w-5" />
          Back
        </button>
        <button 
            onClick={onSubmit} 
            disabled={!isFormValid}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-slate-400 disabled:cursor-not-allowed"
        >
          <Sparkles className="mr-2 -ml-1 h-5 w-5" />
          Get My Analysis
        </button>
      </div>
    </div>
  );
};

export default Step3Symptoms;
