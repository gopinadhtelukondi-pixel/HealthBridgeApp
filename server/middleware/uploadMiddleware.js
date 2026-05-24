import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const doctorStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "healthbridge-doctors",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const hospitalStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "healthbridge-hospitals",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const billStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "healthbridge-bills",
    allowed_formats: ["jpg", "png", "jpeg", "webp", "pdf"],
  },
});

export const uploadDoctorImage = multer({ storage: doctorStorage });
export const uploadHospitalLogo = multer({ storage: hospitalStorage });
export const uploadBill = multer({ storage: billStorage });
export default multer({ storage: billStorage });