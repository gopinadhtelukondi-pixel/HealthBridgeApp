import express from "express";
import { createAssistantAdvice } from "../controllers/assistantController.js";

const router = express.Router();

router.post("/", createAssistantAdvice);

export default router;
