import { GoogleGenAI } from "@google/genai";
import { diagnosisSchema } from "../utils/validator";
import { fallbackDiagnosis } from "../utils/fallback";

// Initialize the GoogleGenAI client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateDiagnosis(userInput: string) {
  try {
    const prompt = `
You are NeuroMed AI, a clinical decision support assistant.
Analyze the following symptoms and return a structured differential diagnosis in JSON format.

SYMPTOMS:
${userInput}

INSTRUCTIONS:
1. Extract clinically relevant symptoms.
2. Generate up to 3 probable conditions with probability scores (0-1).
3. Determine urgency level: Routine, Moderate, Urgent, or Emergency.
4. Suggest a recommended next action.
5. Identify any red flag emergency signs.
6. Provide an overall confidence score (0-1).
7. If the input is vague or insufficient, provide a low confidence diagnosis based on available data.
8. DO NOT ask follow-up questions.
9. DO NOT include markdown, backticks, or any text outside the JSON object.

Return JSON only.
`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        temperature: 0.2,
        responseMimeType: "application/json",
        responseSchema: diagnosisSchema as any
      }
    });

    const text = response.text || "";
    // Basic cleanup in case Gemini still wraps in markdown
    const cleanJson = text.replace(/```json\n?|```/g, '').trim();
    return JSON.parse(cleanJson);

  } catch (error) {
    console.error("Gemini failed:", error);
    return fallbackDiagnosis();
  }
}
