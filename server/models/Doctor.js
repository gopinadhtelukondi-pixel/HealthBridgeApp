import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    legacyId: {
      type: Number,
      index: true,
      unique: true,
      sparse: true,
    },

    name: {
      type: String,
      required: true,
    },

    spec: {
      type: String,
      required: true,
    },

    hospital: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      default: 0,
    },

    reviews: {
      type: Number,
      default: 0,
    },

    fee: {
      type: Number,
      required: true,
    },

    exp: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    color: {
      type: String,
      default: "#0A3D2E",
    },

    initials: {
      type: String,
    },

    tags: [
      {
        type: String,
      },
    ],

    bio: {
      type: String,
    },

    education: {
      type: String,
    },

    nmcId: {
      type: String,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    nabh: {
      type: Boolean,
      default: false,
    },

    reviewsList: [
      {
        // FIX: match the seeded review shape so MongoDB stores all review details.
        author: String,
        initials: String,
        date: String,
        text: String,
        outcome: Number,
        comm: Number,
        cost: Number,
      },
    ],

    certifications: [
      {
        name: String,
        issuer: String,
        year: Number,
        documentUrl: String,
      },
    ],

    achievements: [
      {
        title: String,
        year: Number,
        description: String,
      },
    ],

    qualifications: [
      {
        degree: String,
        institution: String,
        year: Number,
      },
    ],

    profile_updated_at: {
      type: Date,
      default: Date.now,
    },

    response_count: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
