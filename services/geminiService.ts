
import { GoogleGenAI, Type } from "@google/genai";
import type { FullFormData, HealthAnalysis } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        potentialConditions: {
            type: Type.ARRAY,
            description: "A list of potential health conditions based on the user's data. Should be prefixed with 'Possible' or 'Potential'.",
            items: {
                type: Type.OBJECT,
                properties: {
                    condition: { type: Type.STRING, description: "Name of the potential condition (e.g., 'Iron-Deficiency Anemia')." },
                    confidence: { type: Type.STRING, description: "A qualitative confidence level (e.g., 'Low', 'Medium', 'High')." },
                    explanation: { type: Type.STRING, description: "A brief, easy-to-understand explanation of why this condition is suspected, based on the provided data." },
                },
                required: ["condition", "confidence", "explanation"]
            }
        },
        dietarySuggestions: {
            type: Type.OBJECT,
            description: "A personalized diet plan.",
            properties: {
                generalAdvice: { type: Type.ARRAY, items: { type: Type.STRING }, description: "General dietary principles to follow." },
                mealPlan: {
                    type: Type.OBJECT,
                    properties: {
                        breakfast: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Breakfast suggestions." },
                        lunch: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lunch suggestions." },
                        dinner: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Dinner suggestions." },
                        snacks: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Snack suggestions." },
                    },
                    required: ["breakfast", "lunch", "dinner", "snacks"]
                }
            },
            required: ["generalAdvice", "mealPlan"]
        },
        lifestyleRecommendations: {
            type: Type.ARRAY,
            description: "Actionable lifestyle advice (e.g., exercise, sleep).",
            items: { type: Type.STRING }
        },
        specialistRecommendation: {
            type: Type.STRING,
            description: "Suggests the type of medical specialist to consult (e.g., 'Endocrinologist', 'General Physician', 'Hematologist')."
        }
    },
    required: ["potentialConditions", "dietarySuggestions", "lifestyleRecommendations", "specialistRecommendation"]
};

const generatePrompt = (data: FullFormData): string => {
    return `
    Analyze the following health data for an individual.
    **CRITICAL INSTRUCTION: You are an AI health assistant. Your analysis is for informational purposes only and is NOT a medical diagnosis. Always state this. You must not provide a definitive diagnosis. Use phrases like "potential condition" or "may indicate".**

    Here is the user's data:
    - **Profile**:
      - Age: ${data.profile.age || 'Not provided'} years
      - Sex: ${data.profile.sex}
      - Height: ${data.profile.height || 'Not provided'} cm
      - Weight: ${data.profile.weight || 'Not provided'} kg
      - BMI: ${data.bmi}
    - **Lab Results (if provided)**:
      - Hemoglobin: ${data.labResults.hemoglobin || 'N/A'} g/dL
      - Fasting Blood Glucose: ${data.labResults.glucose || 'N/A'} mg/dL
      - TSH (Thyroid-Stimulating Hormone): ${data.labResults.tsh || 'N/A'} mIU/L
      - Blood Pressure: ${data.labResults.systolicBP || 'N/A'} / ${data.labResults.diastolicBP || 'N/A'} mmHg
    - **Reported Symptoms**:
      - "${data.symptoms || 'No specific symptoms reported.'}"

    Based on this information, perform the following tasks and provide the output in JSON format matching the defined schema:
    1.  **Potential Conditions**: Identify potential health issues. For each, provide the condition name, a confidence level (Low, Medium, High), and a brief explanation linking it to the provided data.
    2.  **Dietary Suggestions**: Create a personalized diet plan. Include general advice and specific meal suggestions (breakfast, lunch, dinner, snacks).
    3.  **Lifestyle Recommendations**: Suggest 2-3 actionable lifestyle changes (e.g., exercise, sleep hygiene, stress management).
    4.  **Specialist Recommendation**: Recommend the type of medical specialist the user should consider consulting for a formal diagnosis.
    `;
};


export const getHealthAnalysis = async (data: FullFormData): Promise<HealthAnalysis> => {
    try {
        const prompt = generatePrompt(data);
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);

        // Basic validation to ensure the result matches the expected structure
        if (!result.potentialConditions || !result.dietarySuggestions || !result.lifestyleRecommendations) {
            throw new Error("Received an incomplete or invalid response from the AI model.");
        }
        
        return result as HealthAnalysis;

    } catch (error) {
        console.error("Error in getHealthAnalysis:", error);
        if (error instanceof Error && error.message.includes('API_KEY')) {
            throw new Error("Invalid API Key. Please ensure your Google AI API key is correctly configured in the environment variables.");
        }
        throw new Error("Failed to get health analysis from the AI. The model may have returned an unexpected response.");
    }
};
