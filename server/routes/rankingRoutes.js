import express from "express";
import { getDoctorRankingSummary, getRankedDoctorList } from "../controllers/rankingController.js";

const router = express.Router();

router.get("/doctors", getRankedDoctorList);
router.get("/doctors/:doctorId", getDoctorRankingSummary);

export default router;
