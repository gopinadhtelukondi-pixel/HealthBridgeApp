import express from "express";
import { getEmergency } from "../controllers/emergencyController.js";

const router = express.Router();

router.get("/", getEmergency);

export default router;