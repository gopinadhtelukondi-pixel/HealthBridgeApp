import express from "express";
import { estimateCost } from "../controllers/costController.js";

const router = express.Router();

router.post("/", estimateCost);

export default router;