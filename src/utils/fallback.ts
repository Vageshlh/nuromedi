export function fallbackDiagnosis() {
  return {
    extractedSymptoms: [],
    probableConditions: [
      {
        condition: "Insufficient clinical data",
        probability: 0.0,
        reasoning: "AI could not confidently determine condition."
      }
    ],
    urgencyLevel: "Routine",
    recommendedAction: "Please consult a licensed medical professional.",
    redFlags: [],
    confidenceScore: 0.0
  };
}
