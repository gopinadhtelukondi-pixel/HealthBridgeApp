import jwt from "jsonwebtoken";
import AuthUser from "../models/AuthUser.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) return res.status(401).json({ message: "Authorization token missing" });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await AuthUser.findById(payload.id);
    if (!user) return res.status(401).json({ message: "User not found" });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const signToken = (user) => {
  const payload = { id: user._id.toString(), role: user.role };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

export default auth;
