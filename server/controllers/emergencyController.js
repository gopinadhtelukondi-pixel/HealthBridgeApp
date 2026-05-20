import { EMERGENCY_FACILITIES } from "../data/emergency.js";

export const getEmergency = (req, res) => {
  res.json(EMERGENCY_FACILITIES);
};