import express from "express";
import { uploadHospitalLogo } from "../middleware/uploadMiddleware.js";
import auth from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";
import { createHospital, getHospitals } from "../controllers/hospitalController.js";

const router = express.Router();

router.get("/", getHospitals);
router.post("/", auth, authorize(["admin"]), uploadHospitalLogo.single("logo"), createHospital);

export default router;
