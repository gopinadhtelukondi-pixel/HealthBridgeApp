import Review from "../models/Review.js";
import Doctor from "../models/Doctor.js";
import Hospital from "../models/Hospital.js";

const SUSPICIOUS_WORDS = ["spamword", "buy now", "free", "visit my site"];

const containsSuspiciousLanguage = (text) => {
  if (!text) return false;
  const lower = text.toLowerCase();
  return SUSPICIOUS_WORDS.some((w) => lower.includes(w));
};

const canEditReview = (req, review) => {
  if (req.user?.role === "admin") return true;
  if (req.user?.role === "patient" && review.patientId?.toString() === req.user.id) return true;
  return false;
};

const canRespondToReview = (req, review) => {
  if (req.user?.role !== "doctor") return false;
  return req.user.doctorProfile?.toString() === review.doctorId?.toString();
};

const calculateFraudScore = ({ text, ratings, anonymous, billUrl, patientId }) => {
  let score = 0;
  const flags = [];
  const trimmed = text ? text.trim() : "";
  const length = trimmed.length;
  const ratingValues = ratings ? Object.values(ratings) : [];

  if (containsSuspiciousLanguage(text)) {
    flags.push("suspicious-language");
    score += 30;
  }

  if (anonymous) {
    flags.push("anonymous-review");
    score += 15;
  }

  if (ratingValues.some((v) => v === 1 || v === 5) && length < 40) {
    flags.push("extreme-rating-no-detail");
    score += 20;
  }

  if (length > 0 && length < 20) {
    flags.push("short-review");
    score += 15;
  }

  if (!billUrl && patientId && !anonymous) {
    score += 5;
  }

  if (billUrl && !anonymous) {
    score = Math.max(0, score - 20);
  }

  return { score: Math.min(score, 100), flags: [...new Set(flags)] };
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
    billUrl: r.billUrl,
    reviewSource: r.reviewSource,
    fraudScore: r.fraudScore || 0,
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

export const getReviewSummary = async (req, res) => {
  try {
    const [
      totalReviews,
      pendingReviews,
      approvedReviews,
      rejectedReviews,
      flaggedReviews,
      topHospitals,
    ] = await Promise.all([
      Review.countDocuments(),
      Review.countDocuments({ moderationStatus: "pending" }),
      Review.countDocuments({ moderationStatus: "approved" }),
      Review.countDocuments({ moderationStatus: "rejected" }),
      Review.countDocuments({ moderationStatus: "flagged" }),
      Hospital.find({})
        .sort({ transparencyScore: -1 })
        .limit(5)
        .select("name transparencyScore city")
        .lean(),
    ]);

    const ratingResult = await Review.aggregate([
      { $match: { moderationStatus: "approved" } },
      {
        $project: {
          avgRating: {
            $avg: {
              $map: {
                input: { $objectToArray: "$ratings" },
                as: "rating",
                in: "$rating.v",
              },
            },
          },
        },
      },
      { $group: { _id: null, averageRating: { $avg: "$avgRating" } } },
    ]);

    const averageRating = ratingResult[0]?.averageRating
      ? Number(ratingResult[0].averageRating.toFixed(1))
      : 0;

    const ratingDistributionRaw = await Review.aggregate([
      { $match: { moderationStatus: "approved" } },
      {
        $project: {
          overallRating: {
            $round: [
              {
                $avg: {
                  $map: {
                    input: { $objectToArray: "$ratings" },
                    as: "rating",
                    in: "$rating.v",
                  },
                },
              },
              0,
            ],
          },
        },
      },
      { $group: { _id: "$overallRating", count: { $sum: 1 } } },
      { $sort: { _id: -1 } },
    ]);

    const ratingDistribution = [1, 2, 3, 4, 5].map((rating) => {
      const item = ratingDistributionRaw.find((entry) => entry._id === rating)
      return { rating, count: item?.count || 0 }
    });

    const costTrend = await Review.aggregate([
      { $match: { moderationStatus: "approved" } },
      {
        $lookup: {
          from: "doctors",
          localField: "doctorId",
          foreignField: "_id",
          as: "doctor",
        },
      },
      { $unwind: "$doctor" },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          averageFee: { $avg: "$doctor.fee" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      {
        $project: {
          label: {
            $dateToString: {
              format: "%b %Y",
              date: {
                $dateFromParts: {
                  year: "$_id.year",
                  month: "$_id.month",
                  day: 1,
                },
              },
            },
          },
          value: { $round: ["$averageFee", 0] },
          _id: 0,
        },
      },
    ]);

    const departmentRatings = await Review.aggregate([
      { $match: { moderationStatus: "approved" } },
      {
        $lookup: {
          from: "doctors",
          localField: "doctorId",
          foreignField: "_id",
          as: "doctor",
        },
      },
      { $unwind: "$doctor" },
      {
        $project: {
          spec: "$doctor.spec",
          overallRating: {
            $avg: {
              $map: {
                input: { $objectToArray: "$ratings" },
                as: "rating",
                in: "$rating.v",
              },
            },
          },
        },
      },
      {
        $group: {
          _id: "$spec",
          averageRating: { $avg: "$overallRating" },
          reviewCount: { $sum: 1 },
        },
      },
      { $sort: { averageRating: -1, reviewCount: -1 } },
      { $limit: 6 },
      {
        $project: {
          department: "$_id",
          averageRating: { $round: ["$averageRating", 1] },
          reviewCount: 1,
          _id: 0,
        },
      },
    ]);

    const cityQuality = await Review.aggregate([
      { $match: { moderationStatus: "approved" } },
      {
        $lookup: {
          from: "doctors",
          localField: "doctorId",
          foreignField: "_id",
          as: "doctor",
        },
      },
      { $unwind: "$doctor" },
      {
        $project: {
          city: "$doctor.city",
          overallRating: {
            $avg: {
              $map: {
                input: { $objectToArray: "$ratings" },
                as: "rating",
                in: "$rating.v",
              },
            },
          },
        },
      },
      {
        $group: {
          _id: "$city",
          averageRating: { $avg: "$overallRating" },
          reviewCount: { $sum: 1 },
        },
      },
      { $sort: { averageRating: -1, reviewCount: -1 } },
      { $limit: 6 },
      {
        $project: {
          city: "$_id",
          averageRating: { $round: ["$averageRating", 1] },
          reviewCount: 1,
          _id: 0,
        },
      },
    ]);

    const transparencyByCity = await Hospital.aggregate([
      {
        $group: {
          _id: "$city",
          averageTransparency: { $avg: "$transparencyScore" },
          hospitals: { $sum: 1 },
        },
      },
      { $sort: { averageTransparency: -1, hospitals: -1 } },
      { $limit: 6 },
      {
        $project: {
          city: "$_id",
          averageTransparency: { $round: ["$averageTransparency", 1] },
          hospitals: 1,
          _id: 0,
        },
      },
    ]);

    return res.json({
      totalReviews,
      pendingReviews,
      approvedReviews,
      rejectedReviews,
      flaggedReviews,
      averageRating,
      topHospitals,
      ratingDistribution,
      costTrend,
      departmentRatings,
      cityQuality,
      transparencyByCity,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// Create review
export const createReview = async (req, res) => {
  try {
    const { doctorId, anonymous, ratings, recommend, text, billUrl, reviewSource } = req.body;

    if (!doctorId || !ratings) return res.status(400).json({ message: "doctorId and ratings required" });

    const ratingValues = Object.values(ratings || {});
    if (!ratingValues.length || ratingValues.some((v) => v < 1 || v > 5)) {
      return res.status(400).json({ message: "Ratings must be numbers between 1 and 5" });
    }

    let normalizedPatientId = anonymous ? null : req.user?.id || null;

    // duplicate blocking
    if (normalizedPatientId) {
      const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const existing = await Review.findOne({ doctorId, patientId: normalizedPatientId, createdAt: { $gte: cutoff } });
      if (existing) return res.status(409).json({ message: "Duplicate review detected within 30 days" });
    }

    const fraudAnalysis = calculateFraudScore({ text, ratings, anonymous: !!anonymous, billUrl, patientId: normalizedPatientId });

    const moderationStatus = fraudAnalysis.flags.length ? "pending" : "approved";

    const review = await Review.create({
      doctorId,
      patientId: normalizedPatientId,
      anonymous: !!anonymous,
      verifiedPatient: !!billUrl && !!normalizedPatientId,
      ratings,
      recommend: !!recommend,
      text: text || "",
      billUrl: billUrl || "",
      reviewSource: reviewSource || "web",
      fraudScore: fraudAnalysis.score,
      flags: fraudAnalysis.flags,
      moderationStatus,
    });

    return res.status(201).json(publicReview(review));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const uploadReviewBill = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Bill file is required" });
    const billUrl = req.file.path || req.file.secure_url || "";
    return res.status(201).json({ billUrl });
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
    const { response, moderationStatus, flags, billUrl, reviewSource } = req.body;
    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    if (!canEditReview(req, review)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (response) review.response = { text: response.text, responderId: response.responderId, createdAt: new Date() };
    if (moderationStatus) review.moderationStatus = moderationStatus;
    if (flags) review.flags = flags;
    if (billUrl) {
      review.billUrl = billUrl;
      if (review.patientId && !review.anonymous) review.verifiedPatient = true;
    }
    if (reviewSource) review.reviewSource = reviewSource;
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
    if (req.user.role === "patient" && req.user.id !== patientId) {
      return res.status(403).json({ message: "Forbidden" });
    }
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
    const { text, respondentType = "doctor" } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Response text is required" });
    }

    if (text.trim().length > 500) {
      return res.status(400).json({ message: "Response must be 500 characters or less" });
    }

    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    if (!canRespondToReview(req, review)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    review.response = {
      text: text.trim(),
      responderId: req.user.id,
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
    if (!canRespondToReview(req, review)) {
      return res.status(403).json({ message: "Forbidden" });
    }

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
    if (!canRespondToReview(req, review)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    review.response = undefined;
    await review.save();

    return res.json({ message: "Response deleted", review: publicReview(review) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
