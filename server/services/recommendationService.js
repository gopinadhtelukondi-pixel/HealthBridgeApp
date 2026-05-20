import Hospital from "../models/Hospital.js";
import { CITY_MULTS, COST_DATA, HOSPITAL_MULTS, INS_MULTS } from "../data/cost.js";
import { getRankedDoctors } from "./rankingService.js";

const symptomSpecialtyMap = [
  { specialty: "Cardiologist", words: ["chest pain", "heart", "breath", "breathlessness", "bp", "blood pressure", "palpitation"] },
  { specialty: "Neurologist", words: ["headache", "migraine", "seizure", "stroke", "numbness", "memory"] },
  { specialty: "Orthopedic", words: ["knee", "bone", "fracture", "joint", "back pain", "hip"] },
  { specialty: "Nephrologist", words: ["kidney", "dialysis", "urine", "creatinine"] },
  { specialty: "Oncologist", words: ["cancer", "tumor", "chemotherapy", "chemo"] },
  { specialty: "Gynecologist", words: ["pregnancy", "delivery", "period", "fertility"] },
  { specialty: "Dermatologist", words: ["skin", "rash", "acne", "itching"] },
  { specialty: "Pediatrician", words: ["child", "baby", "fever", "pediatric"] },
];

const preferenceLabels = {
  bestTrust: "best overall trust",
  affordable: "affordability",
  recovery: "reported recovery outcomes",
  communication: "doctor communication",
  lowWait: "shorter waiting time",
};

const inferSpecialty = (symptoms = "") => {
  const lower = symptoms.toLowerCase();
  const match = symptomSpecialtyMap.find(({ words }) => words.some((word) => lower.includes(word)));
  return match?.specialty || "";
};

const calculateCostEstimate = (treatment, hospitalType = "tier2", cityTier = "tier1city", insurance = "none") => {
  const data = COST_DATA[treatment];
  if (!data) return null;

  const mult =
    (HOSPITAL_MULTS[hospitalType] ?? 1) *
    (CITY_MULTS[cityTier] ?? 1) *
    (INS_MULTS[insurance] ?? 1);

  const estimate = {
    p10: Math.round(data.base[0] * mult),
    p50: Math.round(data.base[1] * mult),
    p90: Math.round(data.base[2] * mult),
    procedure: Math.round(data.base[1] * 0.6 * mult),
    room: Math.round(data.room * mult),
    meds: Math.round(data.meds * mult),
    tests: Math.round(data.tests * mult),
  };
  estimate.total = estimate.procedure + estimate.room + estimate.meds + estimate.tests;

  return { treatmentData: data, estimate };
};

const getBudgetStatus = (estimatedCost, budget) => {
  if (!budget || budget <= 0) return "Budget not provided";
  if (estimatedCost <= budget) return "Within budget";
  if (estimatedCost <= budget * 1.25) return "Slightly above budget";
  return "Above budget";
};

const getDoctorRecommendationScore = (doctor, preference, budget) => {
  const ranking = doctor.ranking;
  const scores = ranking.scores;

  const formulas = {
    affordable: ranking.trustScore * 0.45 + scores.affordabilityScore * 0.40 + ranking.recommendationPercentage * 0.15,
    recovery: ranking.trustScore * 0.40 + scores.recoveryScore * 0.40 + scores.communicationScore * 0.20,
    communication: ranking.trustScore * 0.40 + scores.communicationScore * 0.45 + ranking.recommendationPercentage * 0.15,
    lowWait: ranking.trustScore * 0.45 + scores.waitingTimeScore * 0.40 + scores.communicationScore * 0.15,
    bestTrust: ranking.trustScore,
  };

  let score = formulas[preference] ?? formulas.bestTrust;
  if (budget && doctor.fee <= budget) score += 5;
  return Math.round(Math.min(100, score));
};

const buildDoctorReason = (doctor, preference, budgetStatus) => {
  const focus = preferenceLabels[preference] || preferenceLabels.bestTrust;
  const labels = doctor.ranking.labels?.slice(0, 2).join(", ");
  return `Recommended for ${focus}. Trust score is ${doctor.ranking.trustScore}, ${doctor.ranking.recommendationPercentage}% of approved reviewers recommend this doctor, and budget status is ${budgetStatus}.${labels ? ` Key signals: ${labels}.` : ""}`;
};

const buildHospitalReason = (hospital, specialty, urgency) => {
  const departmentMatch = specialty && hospital.departments?.some((dept) =>
    specialty.toLowerCase().includes(dept.toLowerCase()) || dept.toLowerCase().includes(specialty.toLowerCase().replace("ologist", "ology"))
  );

  if (urgency === "emergency" && hospital.emergency) {
    return "Recommended because it offers emergency services in the selected city.";
  }

  if (departmentMatch) {
    return `Recommended because its departments match ${specialty} needs and it has a transparency score of ${hospital.transparencyScore}.`;
  }

  return `Recommended based on city match, facilities, and transparency score of ${hospital.transparencyScore}.`;
};

export const getRecommendations = async (input) => {
  const {
    symptoms = "",
    specialty = "",
    city = "",
    budget,
    urgency = "normal",
    preference = "bestTrust",
    treatment = "",
    hospitalType = "tier2",
    cityTier = "tier1city",
    insurance = "none",
  } = input;

  const inferredSpecialty = specialty || inferSpecialty(symptoms);
  const numericBudget = Number(budget || 0);
  const costEstimate = calculateCostEstimate(treatment, hospitalType, cityTier, insurance);
  const estimatedTreatmentCost = costEstimate?.estimate?.total || 0;

  const rankedDoctors = await getRankedDoctors({ sort: "trust" });
  const matchingDoctors = rankedDoctors
    .filter((doctor) => !city || doctor.city?.toLowerCase() === city.toLowerCase())
    .filter((doctor) => !inferredSpecialty || doctor.spec?.toLowerCase() === inferredSpecialty.toLowerCase())
    .map((doctor) => {
      const estimatedCost = estimatedTreatmentCost || doctor.fee;
      const budgetStatus = getBudgetStatus(estimatedCost, numericBudget);
      const recommendationScore = getDoctorRecommendationScore(doctor, preference, numericBudget);
      return {
        ...doctor,
        recommendationScore,
        budgetStatus,
        estimatedCost,
        recommendationReason: buildDoctorReason(doctor, preference, budgetStatus),
      };
    })
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, 5);

  const hospitalQuery = city ? { city } : {};
  const hospitals = await Hospital.find(hospitalQuery).lean();
  const recommendedHospitals = hospitals
    .map((hospital) => {
      const departmentMatch = inferredSpecialty && hospital.departments?.some((dept) =>
        inferredSpecialty.toLowerCase().includes(dept.toLowerCase()) ||
        dept.toLowerCase().includes(inferredSpecialty.toLowerCase().replace("ologist", "ology"))
      );

      let score = Number(hospital.transparencyScore || 0);
      if (urgency === "emergency" && hospital.emergency) score += 25;
      if (departmentMatch) score += 15;
      if (hospital.accreditation) score += 5;

      return {
        ...hospital,
        id: hospital.legacyId ?? hospital._id.toString(),
        recommendationScore: Math.min(100, score),
        recommendationReason: buildHospitalReason(hospital, inferredSpecialty, urgency),
      };
    })
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, 4);

  const urgencyNotice = urgency === "emergency"
    ? "If symptoms are severe or life-threatening, call emergency services or visit the nearest emergency hospital immediately. This tool must not delay urgent care."
    : "";

  return {
    inferredSpecialty,
    urgencyNotice,
    doctors: matchingDoctors,
    hospitals: recommendedHospitals,
    costEstimate,
    explanation: matchingDoctors.length
      ? `Recommendations prioritize ${preferenceLabels[preference] || "overall trust"} using approved patient reviews, ranking scores, city, specialty, and budget.`
      : "No exact doctor match was found for the selected city and specialty. Try broadening the city or specialty.",
    disclaimer: "HealthBridge recommendations are decision-support signals based on patient-reported data and public profile information. They are not medical diagnosis or emergency advice.",
  };
};
