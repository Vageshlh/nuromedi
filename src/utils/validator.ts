import { z } from "zod";
import { Type } from "@google/genai";

export const DiagnosisZodSchema = z.object({
  extractedSymptoms: z.array(z.string()),
  probableConditions: z.array(
    z.object({
      condition: z.string(),
      probability: z.number(),
      reasoning: z.string()
    })
  ),
  urgencyLevel: z.enum(["Routine", "Moderate", "Urgent", "Emergency"]),
  recommendedAction: z.string(),
  redFlags: z.array(z.string()),
  confidenceScore: z.number()
});

export type DiagnosisResult = z.infer<typeof DiagnosisZodSchema>;

export interface PatientProfile {
  age: number;
  gender: string;
  existingConditions: string[];
  medications: string[];
  allergies: string[];
}

export const diagnosisSchema = {
  type: Type.OBJECT,
  properties: {
    extractedSymptoms: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    probableConditions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          condition: { type: Type.STRING },
          probability: { type: Type.NUMBER },
          reasoning: { type: Type.STRING }
        },
        required: ["condition", "probability", "reasoning"]
      }
    },
    urgencyLevel: {
      type: Type.STRING,
      enum: ["Routine", "Moderate", "Urgent", "Emergency"]
    },
    recommendedAction: { type: Type.STRING },
    redFlags: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    confidenceScore: { type: Type.NUMBER }
  },
  required: [
    "extractedSymptoms",
    "probableConditions",
    "urgencyLevel",
    "recommendedAction",
    "redFlags",
    "confidenceScore"
  ]
};
