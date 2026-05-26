/*
 * src/pages/HospitalsPage.jsx
 * ─────────────────────────────────────────────────────────────
 * Lists all hospitals (API-based)
 */

import { useEffect, useState } from "react";
import { getHospitals } from "@/services/api";
import { HospitalCard } from "@/components/features/hospitals/HospitalCard";

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch hospitals from backend
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const data = await getHospitals();
        setHospitals(data);
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 page-enter">

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl text-primary font-normal mb-2">
          Hospital Intelligence
        </h1>
        <p className="text-ink-mid text-sm sm:text-[16px]">
          AI-computed transparency scores based on verified patient outcomes,
          cost accuracy, and facility standards.
        </p>
      </div>

      {/* Loading */}
      {loading ? (
        <p className="text-ink-muted">Loading hospitals...</p>
      ) : (
        <div className="flex flex-col gap-5">
          {hospitals.map((h) => (
            <HospitalCard key={h.id} hospital={h} />
          ))}
        </div>
      )}
    </div>
  );
}
