import express from "express";
import { uploadDoctorImage } from "../middleware/uploadMiddleware.js";
import auth from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";
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
router.get("/dashboard/:doctorId", auth, authorize(["doctor", "admin"]), getDoctorDashboard);

// GET doctor analytics
router.get("/:doctorId/analytics", auth, authorize(["doctor", "admin"]), getDoctorAnalytics);

// GET doctor dashboard reviews with filters
router.get("/:doctorId/reviews", auth, authorize(["doctor", "admin"]), getDoctorDashboardReviews);

// GET doctor details
router.get("/:id", getDoctorById);

// FIX: use one POST route so optional image uploads and plain form submissions share createDoctor.
router.post("/", auth, authorize(["admin"]), uploadDoctorImage.single("image"), createDoctor);

// PUT doctor profile
router.put("/:id/profile", auth, authorize(["doctor", "admin"]), uploadDoctorImage.single("image"), updateDoctorProfile);

export default router;
