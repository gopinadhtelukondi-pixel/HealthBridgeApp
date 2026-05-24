import express from "express";
import auth from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";
import {
  getAnalyticsOverview,
  getReviewTrends,
  getSpecialtyAnalytics,
  getHospitalCostAnalytics,
  getSentimentAnalytics,
  getEmergencyAnalytics,
  getCityQualityAnalytics,
  getDepartmentRatingAnalytics,
  getRecentActivity,
  getAnalyticsInsights,
} from "../controllers/analyticsController.js";

const router = express.Router();

// All analytics routes require admin authentication
router.use(auth, authorize(["admin"]));

// GET overview KPIs
router.get("/overview", getAnalyticsOverview);

// GET review trends (line chart data)
router.get("/review-trends", getReviewTrends);

// GET specialty analytics (doctor count per specialty)
router.get("/specialties", getSpecialtyAnalytics);

// GET hospital cost analytics
router.get("/hospital-costs", getHospitalCostAnalytics);

// GET sentiment analysis
router.get("/sentiment", getSentimentAnalytics);

// GET emergency analytics
router.get("/emergency", getEmergencyAnalytics);

// GET city quality metrics
router.get("/city-quality", getCityQualityAnalytics);

// GET department ratings
router.get("/department-ratings", getDepartmentRatingAnalytics);

// GET recent activity
router.get("/recent-activity", getRecentActivity);

// GET AI insights
router.get("/insights", getAnalyticsInsights);

export default router;
