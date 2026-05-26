import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() ||
  "https://healthbridgeapp.onrender.com/api";

const API = axios.create({
  baseURL: API_BASE_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("healthbridge_token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// =========================
// AUTH
// =========================
export const registerPatient = async (data) => {
  const res = await API.post("/auth/patient/signup", data);
  return res.data;
};

export const registerDoctor = async (data) => {
  const res = await API.post("/auth/doctor/signup", data);
  return res.data;
};

export const loginUser = async (role, data) => {
  const res = await API.post(`/auth/${role}/login`, data);
  return res.data;
};

// =========================
// DOCTORS
// =========================
export const getDoctors = async () => {
  const res = await API.get("/doctors");
  return res.data;
};

export const getDoctorById = async (id) => {
  const res = await API.get(`/doctors/${id}`);
  return res.data;
};

// =========================
// HOSPITALS
// =========================
export const getHospitals = async () => {
  const res = await API.get("/hospitals");
  return res.data;
};

// =========================
// EMERGENCY FACILITIES
// =========================
export const getEmergencyFacilities = async () => {
  const res = await API.get("/emergency");
  return res.data;
};

// =========================
// MAP DATA
// =========================
export const getMapPoints = async () => {
  const res = await API.get("/map");
  return res.data;
};

// =========================
// COST ESTIMATION
// =========================
export const getCostEstimate = async (data) => {
  const res = await API.post("/cost", data);
  return res.data;
};

// =========================
// PATIENT REVIEWS
// =========================
export const createReview = async (data) => {
  const res = await API.post("/reviews", data);
  return res.data;
};

export const getDoctorReviews = async (doctorId) => {
  const res = await API.get(`/reviews/doctor/${doctorId}`);
  return res.data;
};

export const getHospitalReviews = async (hospitalId) => {
  const res = await API.get(`/reviews/hospital/${hospitalId}`);
  return res.data;
};

export const getMyReviews = async (patientId) => {
  const res = await API.get(`/reviews/me/${patientId}`);
  return res.data;
};

export const getPendingReviews = async () => {
  const res = await API.get(`/reviews/pending`);
  return res.data;
};

export const getReviewSummary = async () => {
  const res = await API.get(`/reviews/summary`);
  return res.data;
};

export const moderateReview = async (reviewId, status) => {
  const res = await API.patch(`/reviews/${reviewId}/moderation`, { moderationStatus: status });
  return res.data;
};

export const uploadReviewBill = async (file) => {
  const formData = new FormData();
  formData.append("bill", file);
  const res = await API.post("/reviews/upload-bill", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// =========================
// SMART DOCTOR RANKINGS
// =========================
export const getRankedDoctors = async (params = {}) => {
  const res = await API.get("/rankings/doctors", { params });
  return res.data;
};

export const getDoctorRanking = async (doctorId) => {
  const res = await API.get(`/rankings/doctors/${doctorId}`);
  return res.data;
};

// =========================
// AI RECOMMENDATIONS
// =========================
export const getRecommendations = async (data) => {
  const res = await API.post("/recommendations", data);
  return res.data;
};

// =========================
// DOCTOR DASHBOARD
// =========================
export const fetchDoctorDashboard = async (doctorId) => {
  const res = await API.get(`/doctors/dashboard/${doctorId}`);
  return res.data;
};

export const fetchDoctorAnalytics = async (doctorId) => {
  const res = await API.get(`/doctors/${doctorId}/analytics`);
  return res.data;
};

export const fetchDoctorDashboardReviews = async (doctorId, params = {}) => {
  const res = await API.get(`/doctors/${doctorId}/reviews`, { params });
  return res.data;
};

export const updateDoctorProfile = async (doctorId, data) => {
  const res = await API.put(`/doctors/${doctorId}/profile`, data);
  return res.data;
};

export const addReviewResponse = async (reviewId, data) => {
  const res = await API.post(`/reviews/${reviewId}/response`, data);
  return res.data;
};

export const updateReviewResponse = async (reviewId, text) => {
  const res = await API.put(`/reviews/${reviewId}/response`, { text });
  return res.data;
};

export const deleteReviewResponse = async (reviewId) => {
  const res = await API.delete(`/reviews/${reviewId}/response`);
  return res.data;
};
