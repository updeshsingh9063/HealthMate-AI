
export enum Step {
  Profile = 1,
  Labs = 2,
  Symptoms = 3,
  Results = 4,
}

export interface ProfileData {
  age: string;
  height: string;
  weight: string;
  sex: 'male' | 'female' | 'other';
}

export interface LabResultData {
  hemoglobin: string;
  glucose: string;
  tsh: string;
  systolicBP: string;
  diastolicBP: string;
}

export interface FormData {
  profile: ProfileData;
  labResults: LabResultData;
  symptoms: string;
}

export interface FullFormData extends FormData {
    bmi: string;
}


export interface PotentialCondition {
    condition: string;
    confidence: 'Low' | 'Medium' | 'High';
    explanation: string;
}

export interface MealPlan {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
    snacks: string[];
}

export interface DietarySuggestions {
    generalAdvice: string[];
    mealPlan: MealPlan;
}

export interface HealthAnalysis {
    potentialConditions: PotentialCondition[];
    dietarySuggestions: DietarySuggestions;
    lifestyleRecommendations: string[];
    specialistRecommendation: string;
}
