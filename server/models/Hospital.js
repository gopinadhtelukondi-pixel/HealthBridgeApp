import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema(
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

    type: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      default: 0,
    },

    transparencyScore: {
      type: Number,
      default: 0,
    },

    beds: {
      type: Number,
      default: 0,
    },

    doctors: {
      type: Number,
      default: 0,
    },

    logo: {
      type: String,
      default: "",
    },

    emergency: {
      type: Boolean,
      default: false,
    },

    departments: [
      {
        type: String,
      },
    ],

    accreditation: {
      type: String,
      default: "",
    },

    established: {
      type: Number,
    },

    address: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Hospital = mongoose.model("Hospital", hospitalSchema);

export default Hospital;
