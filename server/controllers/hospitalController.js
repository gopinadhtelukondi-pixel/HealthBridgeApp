import mongoose from "mongoose";
import Hospital from "../models/Hospital.js";
import { HOSPITALS } from "../data/hospitals.js";

const normalizeHospital = (hospital) => {
  const doc = hospital.toObject ? hospital.toObject() : hospital;
  return {
    ...doc,
    // FIX: expose a stable frontend id whether the source is seeded MongoDB or mock data.
    id: doc.legacyId ?? doc.id ?? doc._id?.toString(),
  };
};

export const getHospitals = async (req, res) => {
  try {
    // FIX: read hospital listings from MongoDB once seeded.
    if (mongoose.connection.readyState === 1) {
      const hospitals = await Hospital.find().lean();
      if (hospitals.length > 0) {
        return res.json(hospitals.map(normalizeHospital));
      }
    }

    res.json(HOSPITALS);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const createHospital = async (req, res) => {
  try {
    const hospitalData = {
      ...req.body,
      logo: req.file?.path || req.body.logo,
    };

    const hospital = await Hospital.create(hospitalData);
    res.status(201).json(normalizeHospital(hospital));
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
