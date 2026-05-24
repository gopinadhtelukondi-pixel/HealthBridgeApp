import { getRecommendations } from "./recommendationService.js";

const EMERGENCY_KEYWORDS = [
  "chest pain",
  "difficulty breathing",
  "shortness of breath",
  "severe bleeding",
  "loss of consciousness",
  "sudden weakness",
  "uncontrolled pain",
  "vision loss",
  "severe headache",
  "stroke",
  "heart attack",
  "seizure",
];

const isEmergencySymptom = (symptoms = "") => {
  const normalized = symptoms.toLowerCase();
  return EMERGENCY_KEYWORDS.some((keyword) => normalized.includes(keyword));
};

const buildAssistantMessage = ({ symptoms, city, urgency = "normal" }, recommendations) => {
  const inferredSpecialty = recommendations.inferredSpecialty || "a relevant specialist";
  const hasEmergency = urgency === "emergency" || isEmergencySymptom(symptoms);
  const symptomText = symptoms?.trim() ? `You described: "${symptoms.trim()}".` : "You did not provide any symptoms.";

  if (hasEmergency) {
    return [
      "This looks like an urgent situation.",
      "Please seek emergency medical care immediately or call local emergency services.",
      `Based on your symptoms, a ${inferredSpecialty} or emergency room may be needed in ${city || "your area"}.`,
      "If you can, share these details with the attending medical team.",
      "This assistant provides decision support only and is not a substitute for professional medical advice.",
    ].join(" ");
  }

  return [
    "HealthBridge Virtual Doctor suggests the following:",
    symptomText,
    `The most likely specialty for your symptoms is ${inferredSpecialty}.`,
    city ? `You are looking in ${city}.` : "You have not selected a city.",
    recommendations.doctors?.length
      ? `I found ${recommendations.doctors.length} recommended doctors for your needs.`
      : "I could not find exact doctor matches for these symptoms and city combination.",
    "Please treat this as guidance only. Consult a qualified healthcare professional for diagnosis and treatment.",
  ].join(" ");
};

export const getAssistantAdvice = async (input) => {
  const recommendations = await getRecommendations(input);
  const assistantMessage = buildAssistantMessage(input, recommendations);
  return {
    assistantMessage,
    ...recommendations,
  };
};
