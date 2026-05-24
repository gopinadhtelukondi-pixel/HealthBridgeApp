import AuthUser from "../models/AuthUser.js";
import Doctor from "../models/Doctor.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { signToken } from "../middleware/auth.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9+\-\s()]{10,16}$/;

const initialsFromName = (name) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

const sanitizeUser = (user, extra = {}) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  phone: user.phone,
  city: user.city,
  role: user.role,
  initials: initialsFromName(user.name),
  doctorId: user.doctorProfile?.toString(),
  ...extra,
});

const requireFields = (body, fields) => {
  const missing = fields.filter((field) => !String(body[field] ?? "").trim());
  return missing.length ? `${missing.join(", ")} required` : "";
};

const validateBaseAuth = ({ name, email, phone, password }, isSignup) => {
  if (!emailRegex.test(String(email || ""))) return "Enter a valid email address";
  if (!String(password || "").trim() || password.length < 6) {
    return "Password must be at least 6 characters";
  }
  if (isSignup && !String(name || "").trim()) return "Full name is required";
  if (isSignup && phone && !phoneRegex.test(phone)) return "Enter a valid phone number";
  return "";
};

export const registerPatient = async (req, res) => {
  try {
    const validationError =
      requireFields(req.body, ["name", "email", "password", "phone", "city"]) ||
      validateBaseAuth(req.body, true);

    if (validationError) return res.status(400).json({ message: validationError });

    const email = req.body.email.toLowerCase().trim();
    const existing = await AuthUser.findOne({ email });
    if (existing) return res.status(409).json({ message: "Email is already registered" });

    const user = await AuthUser.create({
      name: req.body.name.trim(),
      email,
      phone: req.body.phone.trim(),
      city: req.body.city.trim(),
      role: "patient",
      passwordHash: hashPassword(req.body.password),
    });

    res.status(201).json({ user: sanitizeUser(user), token: signToken(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const registerDoctor = async (req, res) => {
  let createdUser;

  try {
    const validationError =
      requireFields(req.body, ["name", "email", "password", "phone", "city", "license", "hospital", "spec", "fee", "exp"]) ||
      validateBaseAuth(req.body, true);

    if (validationError) return res.status(400).json({ message: validationError });

    const fee = Number(req.body.fee);
    const exp = Number(req.body.exp);
    if (!Number.isFinite(fee) || fee <= 0) return res.status(400).json({ message: "Consultation fee must be greater than 0" });
    if (!Number.isFinite(exp) || exp < 0) return res.status(400).json({ message: "Experience cannot be negative" });

    const email = req.body.email.toLowerCase().trim();
    const existing = await AuthUser.findOne({ email });
    if (existing) return res.status(409).json({ message: "Email is already registered" });

    createdUser = await AuthUser.create({
      name: req.body.name.trim(),
      email,
      phone: req.body.phone.trim(),
      city: req.body.city.trim(),
      role: "doctor",
      passwordHash: hashPassword(req.body.password),
    });

    const doctor = await Doctor.create({
      name: req.body.name.trim(),
      spec: req.body.spec.trim(),
      hospital: req.body.hospital.trim(),
      city: req.body.city.trim(),
      fee,
      exp,
      nmcId: req.body.license.trim(),
      initials: initialsFromName(req.body.name),
      bio: req.body.bio?.trim() || "",
      education: req.body.education?.trim() || "",
      tags: req.body.tags
        ? req.body.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
        : [],
      verified: false,
      nabh: false,
    });

    createdUser.doctorProfile = doctor._id;
    await createdUser.save();

    res.status(201).json({
      user: sanitizeUser(createdUser, { doctorId: doctor._id.toString(), hospital: doctor.hospital }),
      doctor,
      token: signToken(createdUser),
    });
  } catch (error) {
    if (createdUser) await AuthUser.findByIdAndDelete(createdUser._id);
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const validationError = validateBaseAuth(req.body, false);
    if (validationError) return res.status(400).json({ message: validationError });

    const user = await AuthUser.findOne({
      email: req.body.email.toLowerCase().trim(),
      role: req.params.role,
    });

    if (!user || !verifyPassword(req.body.password, user.passwordHash)) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({ user: sanitizeUser(user), token: signToken(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
