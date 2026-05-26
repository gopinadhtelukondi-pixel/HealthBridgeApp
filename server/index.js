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

const defaultAllowedOrigins = [
  "http://localhost:5173",
  "https://healthbridge-app-ruddy.vercel.app",
  "https://health-bridge-app-n92m.vercel.app",
];

// Read explicitly allowed origins from env and also accept Vercel preview domains.
const allowedOrigins = new Set(
  (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
    .concat(defaultAllowedOrigins)
);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.has(origin)) return true;

  try {
    const { protocol, hostname } = new URL(origin);
    return protocol === "https:" && hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
};

const corsOptions = {
  origin: (origin, callback) => {
    // Allow browser requests from known origins plus Vercel preview URLs.
    if (isAllowedOrigin(origin)) return callback(null, true);
    return callback(new Error(`CORS_NOT_ALLOWED: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
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
