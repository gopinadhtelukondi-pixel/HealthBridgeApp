import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import {
  createReview,
  uploadReviewBill,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getDoctorReviews,
  getHospitalReviews,
  getMyReviews,
  getPendingReviews,
  getReviewSummary,
  moderateReview,
  addReviewResponse,
  updateReviewResponse,
  deleteReviewResponse,
} from "../controllers/reviewController.js";
import auth from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();

router.post("/", auth, authorize(["patient"]), createReview);
router.post("/upload-bill", auth, authorize(["patient"]), upload.single("bill"), uploadReviewBill);
router.get("/summary", auth, authorize(["admin"]), getReviewSummary);
router.get("/pending", auth, authorize(["admin"]), getPendingReviews);
router.get("/", getReviews);
router.get("/doctor/:doctorId", getDoctorReviews);
router.get("/hospital/:hospitalId", getHospitalReviews);
router.get("/me/:patientId", auth, authorize(["patient", "admin"]), getMyReviews);
router.get("/:id", getReviewById);
router.put("/:id", auth, authorize(["patient", "admin"]), updateReview);
router.patch("/:id/moderation", auth, authorize(["admin"]), moderateReview);
router.post("/:id/response", auth, authorize(["doctor"]), addReviewResponse);
router.put("/:id/response", auth, authorize(["doctor"]), updateReviewResponse);
router.delete("/:id/response", auth, authorize(["doctor"]), deleteReviewResponse);
router.delete("/:id", auth, authorize(["admin"]), deleteReview);

export default router;
