import mongoose from "mongoose";

const authUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    city: {
      type: String,
      trim: true,
      default: "",
    },
    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      required: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    doctorProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },
  },
  {
    timestamps: true,
  }
);

const AuthUser = mongoose.model("AuthUser", authUserSchema);

export default AuthUser;
