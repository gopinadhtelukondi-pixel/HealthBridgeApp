import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctorProfile,
  getDoctorDashboard,
  getDoctorAnalytics,
  getDoctorDashboardReviews,
} from "../controllers/doctorController.js";

const router = express.Router();

// GET doctors
router.get("/", getDoctors);

// GET doctor dashboard
router.get("/dashboard/:doctorId", getDoctorDashboard);

// GET doctor analytics
router.get("/:doctorId/analytics", getDoctorAnalytics);

// GET doctor dashboard reviews with filters
router.get("/:doctorId/reviews", getDoctorDashboardReviews);

// GET doctor details
router.get("/:id", getDoctorById);

// FIX: use one POST route so optional image uploads and plain form submissions share createDoctor.
router.post("/", upload.single("image"), createDoctor);

// PUT doctor profile
router.put("/:id/profile", updateDoctorProfile);

export default router;
