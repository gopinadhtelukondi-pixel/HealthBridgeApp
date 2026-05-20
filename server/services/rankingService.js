import mongoose from "mongoose";
import Doctor from "../models/Doctor.js";
import Review from "../models/Review.js";

const round = (value) => Math.round(Number(value || 0));

const average = (items, selector) => {
  if (!items.length) return 0;
  return items.reduce((sum, item) => sum + Number(selector(item) || 0), 0) / items.length;
};

const normalizeRating = (rating) => Math.min(100, Math.max(0, (Number(rating || 0) / 5) * 100));

const calculateWaitingTimeScore = (minutes) => {
  if (!minutes) return 75;
  if (minutes <= 15) return 100;
  if (minutes <= 30) return 85;
  if (minutes <= 45) return 70;
  if (minutes <= 60) return 55;
  return 40;
};

const calculateExperienceScore = (years) => {
  const exp = Number(years || 0);
  if (exp >= 15) return 100;
  if (exp >= 10) return 75;
  if (exp >= 5) return 50;
  return 20;
};

const calculateTrustVolumeScore = (count) => {
  if (count >= 50) return 100;
  if (count >= 20) return 80;
  if (count >= 5) return 60;
  if (count >= 1) return 25;
  return 0;
};

const calculateTransparencyScore = (doctor, reviewCount) => {
  let score = 30;
  if (doctor.verified) score += 20;
  if (doctor.fee) score += 15;
  if (doctor.education) score += 10;
  if (doctor.hospital) score += 10;
  if (doctor.nmcId) score += 10;
  if (reviewCount > 0) score += 5;
  return Math.min(100, score);
};

const calculateAffordabilityScore = (doctor, allDoctors, reviews) => {
  const peers = allDoctors.filter((peer) =>
    peer._id.toString() !== doctor._id.toString() &&
    peer.spec === doctor.spec &&
    peer.city === doctor.city
  );

  const peerFees = peers.map((peer) => Number(peer.fee || 0)).filter(Boolean);
  const averagePeerFee = peerFees.length ? average(peerFees, (fee) => fee) : Number(doctor.fee || 0);
  const avgReportedCost = average(reviews, (review) => review.approximateCost);

  let feeScore = 65;
  if (averagePeerFee > 0) {
    const ratio = Number(doctor.fee || 0) / averagePeerFee;
    if (ratio <= 0.75) feeScore = 100;
    else if (ratio <= 0.95) feeScore = 80;
    else if (ratio <= 1.15) feeScore = 65;
    else if (ratio <= 1.5) feeScore = 45;
    else feeScore = 25;
  }

  if (!avgReportedCost) return feeScore;

  const costPenalty = avgReportedCost > 100000 ? 10 : avgReportedCost > 50000 ? 5 : 0;
  return Math.max(20, feeScore - costPenalty);
};

const generateLabels = (summary) => {
  const labels = [];
  const { scores, approvedReviewCount, recommendationPercentage, trustScore } = summary;

  if (approvedReviewCount === 0) return ["No patient review data yet"];
  if (approvedReviewCount < 3) labels.push("Limited review data");

  if (scores.patientSatisfactionScore >= 85 && scores.communicationScore >= 80 && recommendationPercentage >= 80) {
    labels.push("Best Patient Care");
  }
  if (scores.affordabilityScore >= 85 && scores.patientSatisfactionScore >= 70) {
    labels.push("Best Affordable Doctor");
  }
  if (scores.affordabilityScore >= 80 && scores.recoveryScore >= 80) {
    labels.push("Low Cost High Success");
  }
  if (trustScore >= 85 && approvedReviewCount >= 5) {
    labels.push("Top Rated Specialist");
  }
  if (scores.waitingTimeScore >= 85) {
    labels.push("Short Waiting Time");
  }
  if (scores.communicationScore >= 90) {
    labels.push("Best Communication");
  }
  if (recommendationPercentage >= 90 && approvedReviewCount >= 5) {
    labels.push("Most Recommended");
  }

  return labels.length ? labels.slice(0, 3) : ["Balanced Care Profile"];
};

const buildInsight = ({ approvedReviewCount, scores, recommendationPercentage, averageWaitingTime }) => {
  if (approvedReviewCount === 0) {
    return "No approved patient review data yet. Profile information is available, but ranking confidence is limited.";
  }

  if (approvedReviewCount < 3) {
    return "Early patient feedback is available, but more approved reviews are needed for a stronger ranking signal.";
  }

  if (scores.communicationScore >= 85 && scores.recoveryScore >= 80) {
    return "Patients report strong communication and positive recovery outcomes for this doctor.";
  }

  if (scores.affordabilityScore >= 85) {
    return "Costs appear favorable compared with similar doctors in this specialty and city.";
  }

  if (averageWaitingTime > 45) {
    return "Patient feedback suggests waiting time is higher than ideal, though care ratings may still be useful.";
  }

  if (recommendationPercentage >= 80) {
    return "Most approved reviewers say they would recommend this doctor.";
  }

  return "Ranking is based on approved patient-reported reviews and profile transparency signals.";
};

export const calculateDoctorRanking = (doctor, reviews, allDoctors) => {
  const approvedReviewCount = reviews.length;
  const averageRating = approvedReviewCount ? average(reviews, (review) => review.overallRating) : Number(doctor.rating || 0);
  const recommendationPercentage = approvedReviewCount
    ? (reviews.filter((review) => review.wouldRecommend).length / approvedReviewCount) * 100
    : 0;
  const recoveryPercentage = approvedReviewCount
    ? (reviews.filter((review) => review.treatmentWorked).length / approvedReviewCount) * 100
    : 0;
  const positiveSentimentPercentage = approvedReviewCount
    ? (reviews.filter((review) => review.sentiment === "positive").length / approvedReviewCount) * 100
    : 0;
  const averageWaitingTime = approvedReviewCount ? average(reviews, (review) => review.waitingTime) : 0;

  const patientSatisfactionScore = approvedReviewCount
    ? (normalizeRating(averageRating) * 0.6) + (recommendationPercentage * 0.3) + (positiveSentimentPercentage * 0.1)
    : normalizeRating(averageRating) * 0.5;

  const scores = {
    patientSatisfactionScore: round(patientSatisfactionScore),
    recoveryScore: round(recoveryPercentage),
    communicationScore: round(normalizeRating(approvedReviewCount ? average(reviews, (review) => review.doctorCommunication) : 0)),
    affordabilityScore: round(calculateAffordabilityScore(doctor, allDoctors, reviews)),
    waitingTimeScore: round(calculateWaitingTimeScore(averageWaitingTime)),
    experienceScore: round(calculateExperienceScore(doctor.exp)),
    trustVolumeScore: round(calculateTrustVolumeScore(approvedReviewCount)),
    transparencyScore: round(calculateTransparencyScore(doctor, approvedReviewCount)),
  };

  const trustScore = round(
    scores.patientSatisfactionScore * 0.25 +
    scores.recoveryScore * 0.20 +
    scores.communicationScore * 0.15 +
    scores.affordabilityScore * 0.15 +
    scores.waitingTimeScore * 0.10 +
    scores.experienceScore * 0.07 +
    scores.trustVolumeScore * 0.05 +
    scores.transparencyScore * 0.03
  );

  const summary = {
    doctorId: doctor._id.toString(),
    trustScore,
    approvedReviewCount,
    averageRating: Number(averageRating.toFixed(1)),
    recommendationPercentage: round(recommendationPercentage),
    averageWaitingTime: round(averageWaitingTime),
    scores,
  };

  return {
    ...summary,
    labels: generateLabels(summary),
    insight: buildInsight(summary),
  };
};

export const getRankedDoctors = async ({ spec, city, sort = "trust" } = {}) => {
  const query = {};
  if (spec) query.spec = spec;
  if (city) query.city = city;

  const doctors = await Doctor.find(query).lean();
  const allDoctors = await Doctor.find().lean();
  const doctorIds = doctors.map((doctor) => doctor._id);
  const reviews = await Review.find({
    doctor: { $in: doctorIds },
    moderationStatus: "approved",
  }).lean();

  const reviewsByDoctor = reviews.reduce((acc, review) => {
    const key = review.doctor.toString();
    acc[key] = acc[key] || [];
    acc[key].push(review);
    return acc;
  }, {});

  const rankedDoctors = doctors.map((doctor) => {
    const ranking = calculateDoctorRanking(doctor, reviewsByDoctor[doctor._id.toString()] || [], allDoctors);
    return {
      ...doctor,
      id: doctor.legacyId ?? doctor._id.toString(),
      ranking,
      rating: ranking.averageRating || doctor.rating,
      reviews: ranking.approvedReviewCount || doctor.reviews || 0,
    };
  });

  return sortRankedDoctors(rankedDoctors, sort);
};

export const getDoctorRanking = async (doctorId) => {
  const numericId = Number(doctorId);
  const legacyQuery = Number.isFinite(numericId) ? [{ legacyId: numericId }] : [];
  const objectIdQuery = mongoose.Types.ObjectId.isValid(doctorId) ? [{ _id: doctorId }] : [];
  const queries = [...objectIdQuery, ...legacyQuery];

  const doctor = queries.length
    ? await Doctor.findOne({ $or: queries }).lean()
    : null;

  if (!doctor) return null;

  const [allDoctors, reviews] = await Promise.all([
    Doctor.find().lean(),
    Review.find({ doctor: doctor._id, moderationStatus: "approved" }).lean(),
  ]);

  return calculateDoctorRanking(doctor, reviews, allDoctors);
};

const sortRankedDoctors = (doctors, sort) => {
  const accessors = {
    trust: (doctor) => doctor.ranking.trustScore,
    affordable: (doctor) => doctor.ranking.scores.affordabilityScore,
    communication: (doctor) => doctor.ranking.scores.communicationScore,
    recovery: (doctor) => doctor.ranking.scores.recoveryScore,
    waitingTime: (doctor) => doctor.ranking.scores.waitingTimeScore,
    recommended: (doctor) => doctor.ranking.recommendationPercentage,
    experience: (doctor) => doctor.ranking.scores.experienceScore,
    rating: (doctor) => doctor.rating || 0,
    reviews: (doctor) => doctor.reviews || 0,
    "fee-low": (doctor) => -(doctor.fee || 0),
    "fee-high": (doctor) => doctor.fee || 0,
  };

  const accessor = accessors[sort] || accessors.trust;
  return [...doctors].sort((a, b) => accessor(b) - accessor(a));
};
