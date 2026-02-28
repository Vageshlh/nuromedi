import { generateDiagnosis } from "./geminiClient";
import { DiagnosisZodSchema } from "../utils/validator";
import { fallbackDiagnosis } from "../utils/fallback";

export async function diagnosisController(input: string) {
  if (!input || input.length < 8) {
    return fallbackDiagnosis();
  }

  const result = await generateDiagnosis(input);

  const parsed = DiagnosisZodSchema.safeParse(result);

  if (!parsed.success) {
    console.error("Schema validation failed", parsed.error);
    return fallbackDiagnosis();
  }

  return parsed.data;
}
