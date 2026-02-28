import { z } from "zod";

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
  redFlags: z.array(z.string()).optional(),
  confidenceScore: z.number()
});

export const diagnosisSchema = {
  type: "object",
  properties: {
    extractedSymptoms: {
      type: "array",
      items: { type: "string" }
    },
    probableConditions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          condition: { type: "string" },
          probability: { type: "number" },
          reasoning: { type: "string" }
        },
        required: ["condition", "probability", "reasoning"]
      }
    },
    urgencyLevel: {
      type: "string",
      enum: ["Routine", "Moderate", "Urgent", "Emergency"]
    },
    recommendedAction: { type: "string" },
    redFlags: {
      type: "array",
      items: { type: "string" }
    },
    confidenceScore: { type: "number" }
  },
  required: [
    "extractedSymptoms",
    "probableConditions",
    "urgencyLevel",
    "recommendedAction",
    "confidenceScore"
  ]
};
