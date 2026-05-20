import mongoose from "mongoose";
import Doctor from "../models/Doctor.js";
import Review from "../models/Review.js";
import { DOCTORS } from "../data/doctors.js";

const normalizeDoctor = (doctor) => {
  const doc = doctor.toObject ? doctor.toObject() : doctor;
  return {
    ...doc,
    // FIX: expose a stable frontend id whether the source is seeded MongoDB or mock data.
    id: doc.legacyId ?? doc.id ?? doc._id?.toString(),
  };
};

export const getDoctors = async (req, res) => {
  try {
    // FIX: keep doctor listing working even when MongoDB has no seeded doctors yet.
    if (mongoose.connection.readyState === 1) {
      const doctors = await Doctor.find().lean();
      if (doctors.length > 0) {
        return res.json(doctors.map(normalizeDoctor));
      }
    }

    res.json(DOCTORS);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    // FIX: prefer MongoDB detail records after seeding, while still accepting old numeric ids.
    if (mongoose.connection.readyState === 1) {
      const numericId = Number(id);
      const legacyQuery = Number.isFinite(numericId) ? [{ legacyId: numericId }] : [];
      const objectIdQuery = mongoose.Types.ObjectId.isValid(id) ? [{ _id: id }] : [];
      const queries = [...objectIdQuery, ...legacyQuery];
      const doctor = queries.length ? await Doctor.findOne({ $or: queries }) : null;

      if (doctor) {
        return res.json(normalizeDoctor(doctor));
      }
    }

    const mockDoctor = DOCTORS.find((doctor) => String(doctor.id) === String(id));
    if (mockDoctor) {
      return res.json(mockDoctor);
    }

    res.status(404).json({ message: "Doctor not found" });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const createDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.create({
      ...req.body,

      image: req.file?.path,
    });

    res.status(201).json(normalizeDoctor(doctor));

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Doctor Dashboard: Update doctor profile
export const updateDoctorProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, city, hospital, spec, fee, exp, bio, education, nmcId, certifications, achievements, qualifications, tags } = req.body;

    // Validate numeric fields
    if (fee !== undefined) {
      const feeNum = Number(fee);
      if (!Number.isFinite(feeNum) || feeNum <= 0) {
        return res.status(400).json({ message: "Consultation fee must be greater than 0" });
      }
    }

    if (exp !== undefined) {
      const expNum = Number(exp);
      if (!Number.isFinite(expNum) || expNum < 0) {
        return res.status(400).json({ message: "Experience cannot be negative" });
      }
    }

    // Check if doctor exists
    const doctor = await Doctor.findById(id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // Update allowed fields
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (city) updateData.city = city;
    if (hospital) updateData.hospital = hospital;
    if (spec) updateData.spec = spec;
    if (fee !== undefined) updateData.fee = Number(fee);
    if (exp !== undefined) updateData.exp = Number(exp);
    if (bio) updateData.bio = bio;
    if (education) updateData.education = education;
    if (nmcId) updateData.nmcId = nmcId;
    if (certifications) updateData.certifications = certifications;
    if (achievements) updateData.achievements = achievements;
    if (qualifications) updateData.qualifications = qualifications;
    if (tags) updateData.tags = tags;
    
    updateData.profile_updated_at = new Date();

    const updatedDoctor = await Doctor.findByIdAndUpdate(id, updateData, { new: true });
    return res.json(normalizeDoctor(updatedDoctor));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// Doctor Dashboard: Get doctor's own dashboard data
export const getDoctorDashboard = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // Get reviews for this doctor
    const reviews = await Review.find({ doctorId }).lean();
    
    // Calculate analytics
    const approvedReviews = reviews.filter(r => r.moderationStatus === "approved");
    const pendingReviews = reviews.filter(r => r.moderationStatus === "pending");
    const flaggedReviews = reviews.filter(r => r.moderationStatus === "flagged");

    const ratingKeys = ["communication", "cost", "recovery", "waitingTime", "staffBehavior"];
    
    // Calculate averages
    const avgRatings = {};
    ratingKeys.forEach(key => {
      const values = approvedReviews
        .map(r => r.ratings?.[key])
        .filter(v => v !== undefined);
      avgRatings[key] = values.length ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2) : 0;
    });

    const overallRatings = approvedReviews
      .map(r => {
        const vals = Object.values(r.ratings || {});
        return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
      });
    
    const overallAvg = overallRatings.length ? (overallRatings.reduce((a, b) => a + b, 0) / overallRatings.length).toFixed(2) : 0;

    const recommendCount = approvedReviews.filter(r => r.recommend === true).length;
    const recommendPercentage = approvedReviews.length ? Math.round((recommendCount / approvedReviews.length) * 100) : 0;

    const verifiedCount = approvedReviews.filter(r => r.verifiedPatient === true).length;
    const responseCount = approvedReviews.filter(r => r.response?.text).length;
    const responseRate = approvedReviews.length ? Math.round((responseCount / approvedReviews.length) * 100) : 0;

    return res.json({
      doctor: normalizeDoctor(doctor),
      totalReviews: reviews.length,
      approvedReviewsCount: approvedReviews.length,
      pendingReviewsCount: pendingReviews.length,
      flaggedReviewsCount: flaggedReviews.length,
      overallAverage: overallAvg,
      averageRatings: avgRatings,
      recommendationPercentage: recommendPercentage,
      verifiedReviewCount: verifiedCount,
      responseRate: responseRate,
      recentReviews: approvedReviews.slice(0, 5).map(publicReview),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// Helper function to format review for public display
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

// Doctor Dashboard: Get detailed analytics
export const getDoctorAnalytics = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const reviews = await Review.find({ doctorId }).lean();
    const approvedReviews = reviews.filter(r => r.moderationStatus === "approved");

    const ratingKeys = ["communication", "cost", "recovery", "waitingTime", "staffBehavior"];
    
    const avgRatings = {};
    ratingKeys.forEach(key => {
      const values = approvedReviews
        .map(r => r.ratings?.[key])
        .filter(v => v !== undefined);
      avgRatings[key] = values.length ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2) : 0;
    });

    const overallRatings = approvedReviews
      .map(r => {
        const vals = Object.values(r.ratings || {});
        return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
      });
    
    const overallAvg = overallRatings.length ? (overallRatings.reduce((a, b) => a + b, 0) / overallRatings.length).toFixed(2) : 0;

    // Sentiment analysis (simple based on overall rating)
    const sentimentBreakdown = { positive: 0, neutral: 0, negative: 0 };
    approvedReviews.forEach(r => {
      const vals = Object.values(r.ratings || {});
      const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
      if (avg >= 4) sentimentBreakdown.positive++;
      else if (avg >= 3) sentimentBreakdown.neutral++;
      else sentimentBreakdown.negative++;
    });

    const recommendCount = approvedReviews.filter(r => r.recommend === true).length;
    const recommendPercentage = approvedReviews.length ? Math.round((recommendCount / approvedReviews.length) * 100) : 0;

    const verifiedCount = approvedReviews.filter(r => r.verifiedPatient === true).length;
    const responseCount = approvedReviews.filter(r => r.response?.text).length;
    const responseRate = approvedReviews.length ? Math.round((responseCount / approvedReviews.length) * 100) : 0;

    return res.json({
      totalReviews: reviews.length,
      approvedReviews: approvedReviews.length,
      pendingReviews: reviews.filter(r => r.moderationStatus === "pending").length,
      flaggedReviews: reviews.filter(r => r.moderationStatus === "flagged").length,
      overallAverage: overallAvg,
      averageRatings: avgRatings,
      recommendationPercentage: recommendPercentage,
      verifiedReviewCount: verifiedCount,
      responseRate: responseRate,
      sentimentBreakdown: sentimentBreakdown,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// Doctor Dashboard: Get reviews with filtering
export const getDoctorDashboardReviews = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { status = "all", sort = "newest", page = 1, limit = 10, search } = req.query;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const query = { doctorId };
    
    if (status !== "all") {
      query.moderationStatus = status;
    }

    let reviews = await Review.find(query).lean();

    // Apply search filter if provided
    if (search) {
      const searchLower = search.toLowerCase();
      reviews = reviews.filter(r =>
        (r.text && r.text.toLowerCase().includes(searchLower)) ||
        (r.patientName && r.patientName.toLowerCase().includes(searchLower))
      );
    }

    // Apply sorting
    if (sort === "oldest") {
      reviews.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sort === "highest") {
      reviews.sort((a, b) => {
        const avgA = Object.values(a.ratings || {}).length ? Object.values(a.ratings).reduce((x, y) => x + y) / Object.values(a.ratings).length : 0;
        const avgB = Object.values(b.ratings || {}).length ? Object.values(b.ratings).reduce((x, y) => x + y) / Object.values(b.ratings).length : 0;
        return avgB - avgA;
      });
    } else if (sort === "lowest") {
      reviews.sort((a, b) => {
        const avgA = Object.values(a.ratings || {}).length ? Object.values(a.ratings).reduce((x, y) => x + y) / Object.values(a.ratings).length : 0;
        const avgB = Object.values(b.ratings || {}).length ? Object.values(b.ratings).reduce((x, y) => x + y) / Object.values(b.ratings).length : 0;
        return avgA - avgB;
      });
    } else {
      reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Apply pagination
    const skip = (Number(page) - 1) * Number(limit);
    const paginatedReviews = reviews.slice(skip, skip + Number(limit));

    return res.json({
      items: paginatedReviews.map(publicReview),
      total: reviews.length,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(reviews.length / Number(limit)),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
