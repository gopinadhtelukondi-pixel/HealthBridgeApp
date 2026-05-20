import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

// ROUTES
import doctorRoutes from "./routes/doctorRoutes.js";
import hospitalRoutes from "./routes/hospitalRoutes.js";
import emergencyRoutes from "./routes/emergencyRoutes.js";
import mapRoutes from "./routes/mapRoutes.js";
import costRoutes from "./routes/costRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import rankingRoutes from "./routes/rankingRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";

dotenv.config();

// CONNECT DATABASE
connectDB();

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("HealthBridge API Running");
});

// API ROUTES
app.use("/api/doctors", doctorRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/map", mapRoutes);
// FIX: mount the cost API used by the frontend estimator.
app.use("/api/cost", costRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/rankings", rankingRoutes);
app.use("/api/recommendations", recommendationRoutes);

// PORT
const PORT = process.env.PORT || 5000;

// START SERVER
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
