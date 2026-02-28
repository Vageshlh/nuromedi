import { GoogleGenAI } from "@google/genai";
import { diagnosisSchema } from "../utils/validator.js";
import { fallbackDiagnosis } from "../utils/fallback.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function generateDiagnosis(userInput) {
  try {
    const prompt = `
You are NeuroMed AI, a clinical decision support assistant.

Analyze the following symptoms and return structured JSON.

Symptoms:
${userInput}

Return JSON only.
`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        temperature: 0.2,
        responseMimeType: "application/json",
        responseSchema: diagnosisSchema
      }
    });

    const text =
      response.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!text) {
      console.error("Empty Gemini response");
      return fallbackDiagnosis();
    }

    return JSON.parse(text);

  } catch (error) {
    console.error("Gemini failed:", error);
    return fallbackDiagnosis();
  }
}
