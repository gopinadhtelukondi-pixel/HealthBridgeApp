import express from "express";
import {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getDoctorReviews,
  getHospitalReviews,
  getMyReviews,
  getPendingReviews,
  moderateReview,
  addReviewResponse,
  updateReviewResponse,
  deleteReviewResponse,
} from "../controllers/reviewController.js";

const router = express.Router();

router.post("/", createReview);
router.get("/pending", getPendingReviews);
router.get("/", getReviews);
router.get("/doctor/:doctorId", getDoctorReviews);
router.get("/hospital/:hospitalId", getHospitalReviews);
router.get("/me/:patientId", getMyReviews);
router.get("/:id", getReviewById);
router.put("/:id", updateReview);
router.patch("/:id/moderation", moderateReview);
router.post("/:id/response", addReviewResponse);
router.put("/:id/response", updateReviewResponse);
router.delete("/:id/response", deleteReviewResponse);
router.delete("/:id", deleteReview);

export default router;
