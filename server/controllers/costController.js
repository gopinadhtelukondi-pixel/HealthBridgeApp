import { CITY_MULTS, COST_DATA, HOSPITAL_MULTS, INS_MULTS } from "../data/cost.js";

export const estimateCost = (req, res) => {
  const {
    treatment,
    hospitalType = "tier2",
    cityTier = "tier1city",
    insurance = "none",
  } = req.body;

  const data = COST_DATA[treatment];

  if (!data) {
    return res.status(404).json({ message: "Treatment not found" });
  }

  // FIX: return calculated estimate fields expected by the React cost UI.
  const mult =
    (HOSPITAL_MULTS[hospitalType] ?? 1) *
    (CITY_MULTS[cityTier] ?? 1) *
    (INS_MULTS[insurance] ?? 1);

  const estimate = {
    p10: Math.round(data.base[0] * mult),
    p50: Math.round(data.base[1] * mult),
    p90: Math.round(data.base[2] * mult),
    procedure: Math.round(data.base[1] * 0.6 * mult),
    room: Math.round(data.room * mult),
    meds: Math.round(data.meds * mult),
    tests: Math.round(data.tests * mult),
  };

  estimate.total = estimate.procedure + estimate.room + estimate.meds + estimate.tests;

  res.json({
    treatmentData: data,
    estimate,
  });
};
