import { getDoctorRanking, getRankedDoctors } from "../services/rankingService.js";

export const getRankedDoctorList = async (req, res) => {
  try {
    const doctors = await getRankedDoctors(req.query);
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDoctorRankingSummary = async (req, res) => {
  try {
    const ranking = await getDoctorRanking(req.params.doctorId);
    if (!ranking) return res.status(404).json({ message: "Doctor not found" });
    res.json(ranking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
