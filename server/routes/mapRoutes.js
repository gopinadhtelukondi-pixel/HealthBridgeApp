import express from "express";
import { getMapPoints } from "../controllers/mapController.js";

const router = express.Router();

router.get("/", getMapPoints);

export default router;