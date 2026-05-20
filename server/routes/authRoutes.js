import express from "express";
import { loginUser, registerDoctor, registerPatient } from "../controllers/authController.js";

const router = express.Router();

router.post("/patient/signup", registerPatient);
router.post("/doctor/signup", registerDoctor);
router.post("/:role/login", loginUser);

export default router;
