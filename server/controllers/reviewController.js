import Review from "../models/Review.js";

const SUSPICIOUS_WORDS = ["spamword", "buy now", "free", "visit my site"];

const containsSuspiciousLanguage = (text) => {
  if (!text) return false;
  const lower = text.toLowerCase();
  return SUSPICIOUS_WORDS.some((w) => lower.includes(w));
};

const publicReview = (r) => {
  const ratingValues = r.ratings ? Object.values(r.ratings) : [];
  const overallRating = ratingValues.length
    ? Math.round(ratingValues.reduce((sum, value) => sum + value, 0) / ratingValues.length)
    : 0;

  return {
    id: r._id,
    doctorId: r.doctorId,
    patientId: r.patientId,
    anonymous: r.anonymous,
    verifiedPatient: r.verifiedPatient,
    patientName: r.anonymous ? "Anonymous Patient" : r.patientName || "Patient",
    patientInitials: r.anonymous ? "AP" : r.patientInitials || "PT",
    ratings: r.ratings,
    overallRating,
    recommend: r.recommend,
    reviewText: r.text,
    response: r.response,
    flags: r.flags,
    moderationStatus: r.moderationStatus,
    createdAt: r.createdAt,
  };
};

export const getPendingReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ moderationStatus: "pending" })
      .sort({ createdAt: -1 })
      .lean();
    return res.json(reviews.map(publicReview));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// Create review
export const createReview = async (req, res) => {
  try {
    const { doctorId, patientId, anonymous, ratings, recommend, text } = req.body;

    if (!doctorId || !ratings) return res.status(400).json({ message: "doctorId and ratings required" });

    const ratingValues = Object.values(ratings || {});
    if (!ratingValues.length || ratingValues.some((v) => v < 1 || v > 5)) {
      return res.status(400).json({ message: "Ratings must be numbers between 1 and 5" });
    }

    let normalizedPatientId = patientId || null;
    if (anonymous) normalizedPatientId = null;

    // duplicate blocking
    if (normalizedPatientId) {
      const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const existing = await Review.findOne({ doctorId, patientId: normalizedPatientId, createdAt: { $gte: cutoff } });
      if (existing) return res.status(409).json({ message: "Duplicate review detected within 30 days" });
    }

    const flags = [];
    if (containsSuspiciousLanguage(text)) flags.push("suspicious-language");
    const hasExtreme = ratingValues.some((v) => v === 1 || v === 5);
    if (hasExtreme && (!text || text.trim().length < 20)) flags.push("extreme-no-details");

    const moderationStatus = "pending";

    const review = await Review.create({
      doctorId,
      patientId: normalizedPatientId,
      anonymous: !!anonymous,
      verifiedPatient: false,
      ratings,
      recommend: !!recommend,
      text: text || "",
      flags,
      moderationStatus,
    });

    return res.status(201).json(publicReview(review));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getReviews = async (req, res) => {
  try {
    const { doctorId, page = 1, limit = 10, includePending } = req.query;
    const query = {};
    if (doctorId) query.doctorId = doctorId;
    if (!includePending) query.moderationStatus = "approved";
    const skip = (Number(page) - 1) * Number(limit);
    const reviews = await Review.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean();
    return res.json({ items: reviews.map(publicReview) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id).lean();
    if (!review) return res.status(404).json({ message: "Review not found" });
    return res.json(publicReview(review));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { response, moderationStatus, flags } = req.body;
    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    if (response) review.response = { text: response.text, responderId: response.responderId, createdAt: new Date() };
    if (moderationStatus) review.moderationStatus = moderationStatus;
    if (flags) review.flags = flags;
    await review.save();
    return res.json(publicReview(review));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndDelete(id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    return res.json({ message: "Review deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getDoctorReviews = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const reviews = await Review.find({ doctorId, moderationStatus: "approved" }).sort({ createdAt: -1 }).lean();
    return res.json(reviews.map(publicReview));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getHospitalReviews = async (req, res) => {
  try {
    // No hospitalId stored on review in this model; return empty array for now.
    return res.json([]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getMyReviews = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const reviews = await Review.find({ patientId }).sort({ createdAt: -1 }).lean();
    return res.json(reviews.map(publicReview));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const moderateReview = async (req, res) => {
  try {
    const { moderationStatus } = req.body;
    if (!["pending", "approved", "rejected", "flagged"].includes(moderationStatus)) {
      return res.status(400).json({ message: "Invalid moderation status" });
    }
    const review = await Review.findByIdAndUpdate(req.params.id, { moderationStatus }, { new: true }).lean();
    if (!review) return res.status(404).json({ message: "Review not found" });
    return res.json(publicReview(review));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// Add response to review
export const addReviewResponse = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, responderId, respondentType = "doctor" } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Response text is required" });
    }

    if (text.trim().length > 500) {
      return res.status(400).json({ message: "Response must be 500 characters or less" });
    }

    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    review.response = {
      text: text.trim(),
      responderId,
      respondedAt: new Date(),
      respondentType,
    };

    await review.save();
    return res.json(publicReview(review));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// Update response to review
export const updateReviewResponse = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Response text is required" });
    }

    if (text.trim().length > 500) {
      return res.status(400).json({ message: "Response must be 500 characters or less" });
    }

    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    if (!review.response) return res.status(404).json({ message: "No response found to update" });

    review.response.text = text.trim();
    review.response.respondedAt = new Date();

    await review.save();
    return res.json(publicReview(review));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// Delete response from review
export const deleteReviewResponse = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    if (!review.response) return res.status(404).json({ message: "No response found to delete" });

    review.response = undefined;
    await review.save();

    return res.json({ message: "Response deleted", review: publicReview(review) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
