import { useState, useEffect } from "react";
import { getRankedDoctors } from "@/services/api";

export function useSearch(initialQuery = "") {
  // 🔍 Search states
  const [query, setQuery] = useState(initialQuery);
  const [specialty, setSpecialty] = useState("");
  const [sortBy, setSortBy] = useState("trust");

  // 📦 Data states
  const [allDoctors, setAllDoctors] = useState([]);
  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(false);

  // ✅ STEP 3: Fetch doctors from backend
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const data = await getRankedDoctors();
      setAllDoctors(data || []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setAllDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ STEP 4: Filter + Sort logic
  useEffect(() => {
    let filtered = [...allDoctors];

    const q = query.toLowerCase();

    // 🔎 Search filter
    if (q) {
      filtered = filtered.filter((d) =>
        d.name?.toLowerCase().includes(q) ||
        d.spec?.toLowerCase().includes(q) ||
        d.hospital?.toLowerCase().includes(q) ||
        d.city?.toLowerCase().includes(q)
      );
    }

    // 🏥 Specialty filter
    if (specialty) {
      filtered = filtered.filter((d) => d.spec === specialty);
    }

    // 🔄 Sorting
    switch (sortBy) {
      case "trust":
        filtered.sort((a, b) => (b.ranking?.trustScore || 0) - (a.ranking?.trustScore || 0));
        break;
      case "affordable":
        filtered.sort((a, b) => (b.ranking?.scores?.affordabilityScore || 0) - (a.ranking?.scores?.affordabilityScore || 0));
        break;
      case "communication":
        filtered.sort((a, b) => (b.ranking?.scores?.communicationScore || 0) - (a.ranking?.scores?.communicationScore || 0));
        break;
      case "recovery":
        filtered.sort((a, b) => (b.ranking?.scores?.recoveryScore || 0) - (a.ranking?.scores?.recoveryScore || 0));
        break;
      case "waitingTime":
        filtered.sort((a, b) => (b.ranking?.scores?.waitingTimeScore || 0) - (a.ranking?.scores?.waitingTimeScore || 0));
        break;
      case "recommended":
        filtered.sort((a, b) => (b.ranking?.recommendationPercentage || 0) - (a.ranking?.recommendationPercentage || 0));
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "fee-low":
        filtered.sort((a, b) => (a.fee || 0) - (b.fee || 0));
        break;
      case "fee-high":
        filtered.sort((a, b) => (b.fee || 0) - (a.fee || 0));
        break;
      case "reviews":
        filtered.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
        break;
      default:
        break;
    }

    setResults(filtered);
  }, [query, specialty, sortBy, allDoctors]);

  // ✅ STEP 5: Return everything
  return {
    query,
    setQuery,
    specialty,
    setSpecialty,
    sortBy,
    setSortBy,
    results,
    loading,
  };
}
