import mongoose from "mongoose";
import Doctor from "../models/Doctor.js";
import Hospital from "../models/Hospital.js";
import { EMERGENCY_FACILITIES } from "../data/emergency.js";
import { DOCTORS } from "../data/doctors.js";
import { HOSPITALS } from "../data/hospitals.js";

const normalizePoint = (point, type) => {
  const doc = point.toObject ? point.toObject() : point;
  return {
    id: doc.legacyId ?? doc.id ?? doc._id?.toString(),
    type,
    name: doc.name,
    description:
      type === "hospital"
        ? doc.type || doc.address || `${doc.city} healthcare facility`
        : type === "doctor"
        ? `${doc.spec} at ${doc.hospital}`
        : doc.type || "Emergency facility",
    lat: doc.lat ?? doc.location?.lat ?? null,
    lng: doc.lng ?? doc.location?.lng ?? null,
    rating: doc.rating ?? 0,
    beds: doc.beds ?? 0,
    city: doc.city,
    address: doc.address,
  };
};

const normalizeEmergencyPoint = (facility) => ({
  id: facility.id,
  type: "emergency",
  name: facility.name,
  description: facility.type,
  lat: facility.lat,
  lng: facility.lng,
  rating: facility.rating ?? 0,
  beds: facility.beds ?? 0,
  city: facility.city,
  address: facility.address,
});

export const getMapPoints = async (req, res) => {
  try {
    const hospitals = mongoose.connection.readyState === 1 ? await Hospital.find().lean() : [];
    const doctors = mongoose.connection.readyState === 1 ? await Doctor.find().lean() : [];

    const hospitalSource = hospitals.length > 0 ? hospitals : HOSPITALS;
    const doctorSource = doctors.length > 0 ? doctors : DOCTORS;

    const hospitalPoints = hospitalSource
      .map((hospital) => normalizePoint(hospital, "hospital"))
      .filter((point) => point.lat != null && point.lng != null);

    const doctorPoints = doctorSource
      .map((doctor) => normalizePoint(doctor, "doctor"))
      .filter((point) => point.lat != null && point.lng != null);

    const emergencyPoints = EMERGENCY_FACILITIES.filter((facility) => facility.lat != null && facility.lng != null).map(normalizeEmergencyPoint);

    res.json([...hospitalPoints, ...doctorPoints, ...emergencyPoints]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};