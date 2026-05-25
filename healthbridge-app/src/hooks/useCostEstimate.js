import { useCallback, useEffect, useState } from "react";
import { getCostEstimate } from "@/services/api";

export function useCostEstimate() {
  const [treatment, setTreatment] = useState("");
  const [hospitalType, setHospitalType] = useState("tier2");
  const [cityTier, setCityTier] = useState("tier1city");
  const [insurance, setInsurance] = useState("none");

  const [estimate, setEstimate] = useState(null);
  const [treatmentData, setTreatmentData] = useState(null);
  const [loading, setLoading] = useState(false);

  // FIX: wrap the API call in useCallback so hook dependencies stay correct.
  const fetchEstimate = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getCostEstimate({
        treatment,
        hospitalType,
        cityTier,
        insurance,
      });

      // FIX: backend now returns both display metadata and calculated estimate bands.
      setTreatmentData(data.treatmentData || null);
      setEstimate(data.estimate || null);
    } catch (err) {
      console.error("Error fetching cost estimate:", err);
      setTreatmentData(null);
      setEstimate(null);
    } finally {
      setLoading(false);
    }
  }, [treatment, hospitalType, cityTier, insurance]);

  // Call backend when inputs change.
  useEffect(() => {
    if (!treatment) return;

    fetchEstimate();
  }, [treatment, fetchEstimate]);

  return {
    treatment,
    setTreatment,
    hospitalType,
    setHospitalType,
    cityTier,
    setCityTier,
    insurance,
    setInsurance,
    estimate,
    treatmentData,
    loading,
  };
}
