import { generateDiagnosis } from "./geminiClient.js";
import { DiagnosisZodSchema } from "../utils/validator.js";
import { fallbackDiagnosis } from "../utils/fallback.js";

export async function diagnosisController(input) {
  if (!input || input.length < 5) {
    return fallbackDiagnosis();
  }

  const result = await generateDiagnosis(input);

  const parsed = DiagnosisZodSchema.safeParse(result);

  if (!parsed.success) {
    console.error("Schema validation failed:", parsed.error);
    return fallbackDiagnosis();
  }

  return parsed.data;
}
