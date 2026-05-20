import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import Doctor from "../models/Doctor.js";
import Hospital from "../models/Hospital.js";
import Review from "../models/Review.js";
import { DOCTORS } from "../data/doctors.js";
import { HOSPITALS } from "../data/hospitals.js";

dotenv.config();

const prepareSeedDocs = (items) =>
  items.map(({ id, ...item }) => ({
    ...item,
    // FIX: keep the old numeric ids for frontend routes after moving data into MongoDB.
    legacyId: id,
  }));

const seedDatabase = async () => {
  try {
    await connectDB();

    // FIX: refresh seed collections so repeated `npm run seed` stays predictable.
    await Doctor.deleteMany({});
    await Hospital.deleteMany({});

    const doctors = await Doctor.insertMany(prepareSeedDocs(DOCTORS));
    const hospitals = await Hospital.insertMany(prepareSeedDocs(HOSPITALS));

    // refresh reviews
    await Review.deleteMany({});

    // Add a few sample reviews for the first doctors
    const sampleReviews = [
      {
        doctorId: doctors[0]._id,
        patientId: null,
        anonymous: true,
        verifiedPatient: false,
        ratings: { communication: 5, cost: 3, recovery: 4, waitingTime: 2, staffBehavior: 5 },
        recommend: true,
        text: "Explained everything clearly and helped my recovery.",
        flags: [],
        moderationStatus: "approved",
      },
      {
        doctorId: doctors[1]._id,
        patientId: null,
        anonymous: true,
        verifiedPatient: false,
        ratings: { communication: 3, cost: 4, recovery: 3, waitingTime: 4, staffBehavior: 3 },
        recommend: false,
        text: "Long wait but competent care.",
        flags: [],
        moderationStatus: "approved",
      },
    ];

    await Review.insertMany(sampleReviews);

    console.log(`Seeded ${doctors.length} doctors and ${hospitals.length} hospitals into MongoDB.`);
  } catch (error) {
    console.error("Database seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seedDatabase();
