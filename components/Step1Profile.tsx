
import React from 'react';
import type { ProfileData } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChevronRight } from 'lucide-react';

interface Props {
  data: ProfileData;
  updateData: (data: Partial<ProfileData>) => void;
  onNext: () => void;
  bmi: string | null;
}

const BMICategory = ({ bmi }: { bmi: number | null }) => {
    if (bmi === null) return null;

    let category = '';
    let color = '';

    if (bmi < 18.5) {
        category = 'Underweight';
        color = '#3b82f6'; // blue-500
    } else if (bmi >= 18.5 && bmi < 25) {
        category = 'Normal weight';
        color = '#22c55e'; // green-500
    } else if (bmi >= 25 && bmi < 30) {
        category = 'Overweight';
        color = '#f97316'; // orange-500
    } else {
        category = 'Obese';
        color = '#ef4444'; // red-500
    }

    const chartData = [
      { name: 'Underweight', range: 18.5, value: bmi < 18.5 ? bmi : 18.5 },
      { name: 'Normal', range: 24.9, value: bmi >= 18.5 && bmi < 25 ? bmi: 0 },
      { name: 'Overweight', range: 29.9, value: bmi >= 25 && bmi < 30 ? bmi: 0 },
      { name: 'Obese', range: 40, value: bmi >= 30 ? bmi: 0 },
    ];
    
    // This is a simplified chart just to give a visual cue
    const displayData = [{ name: 'BMI', value: bmi }];


    return (
        <div className="mt-6 p-4 bg-slate-50 rounded-lg text-center">
            <h4 className="font-semibold text-slate-700">Your Body Mass Index (BMI)</h4>
            <p className="text-4xl font-bold mt-2" style={{ color }}>{bmi}</p>
            <p className="font-semibold" style={{ color }}>{category}</p>
        </div>
    );
};


const Step1Profile: React.FC<Props> = ({ data, updateData, onNext, bmi }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    updateData({ [e.target.name]: e.target.value });
  };
  
  const isFormValid = data.age && data.height && data.weight;

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800 mb-1">Personal Profile</h2>
      <p className="text-slate-500 mb-6">Let's start with the basics. This helps us personalize your analysis.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-slate-700">Age</label>
              <input type="number" name="age" id="age" value={data.age} onChange={handleChange} placeholder="e.g., 35" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="sex" className="block text-sm font-medium text-slate-700">Sex</label>
              <select name="sex" id="sex" value={data.sex} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
             <div>
              <label htmlFor="height" className="block text-sm font-medium text-slate-700">Height (cm)</label>
              <input type="number" name="height" id="height" value={data.height} onChange={handleChange} placeholder="e.g., 175" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-slate-700">Weight (kg)</label>
              <input type="number" name="weight" id="weight" value={data.weight} onChange={handleChange} placeholder="e.g., 70" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm" />
            </div>
        </div>
        <div className="flex items-center justify-center">
             <BMICategory bmi={bmi ? parseFloat(bmi) : null} />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button onClick={onNext} disabled={!isFormValid} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:bg-slate-400 disabled:cursor-not-allowed">
          Next: Lab Reports
          <ChevronRight className="ml-2 -mr-1 h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Step1Profile;
