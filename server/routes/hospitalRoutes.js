import express from "express";
import { createHospital, getHospitals } from "../controllers/hospitalController.js";

const router = express.Router();

router.get("/", getHospitals);
router.post("/", createHospital);

export default router;
