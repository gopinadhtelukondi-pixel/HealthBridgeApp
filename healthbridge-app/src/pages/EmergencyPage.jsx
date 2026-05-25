/*
 * src/pages/EmergencyPage.jsx
 * ─────────────────────────────────────────────────────────────
 * Emergency healthcare facility finder (API-based)
 * ─────────────────────────────────────────────────────────────
 */

import { useEffect, useState } from "react";
import { getEmergencyFacilities } from "@/services/api";
import { EmergencyCard } from "@/components/features/emergency/EmergencyCard";

export default function EmergencyPage() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getEmergencyFacilities();
        setFacilities(data);
      } catch (error) {
        console.error("Error fetching emergency facilities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-bg-dark min-h-screen text-white px-8 py-10 page-enter">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-full bg-danger flex items-center justify-center mx-auto mb-6 text-[32px] animate-pulse-red">
            🚨
          </div>
          <h1 className="font-serif text-4xl text-white font-normal mb-2">
            Emergency Healthcare
          </h1>
          <p className="text-white/60 text-[16px]">
            Nearest emergency facilities — sorted by travel time
          </p>
        </div>

        {/* Call Banner */}
        <div className="bg-danger/20 border border-danger/40 rounded-xl2 p-5 mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="font-bold text-white text-[16px]">
              National Ambulance Service
            </p>
            <p className="text-white/60 text-sm">
              Available 24/7 anywhere in India
            </p>
          </div>
          <a
            href="tel:108"
            className="bg-danger text-white font-bold text-xl px-8 py-3 rounded-xl no-underline hover:bg-[#a93226]"
          >
            📞 Call 108
          </a>
        </div>

        {/* Loading */}
        {loading ? (
          <p className="text-center text-white/60">Loading emergency facilities...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {facilities.map((f) => (
              <EmergencyCard key={f.id} facility={f} />
            ))}
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-white/30 text-xs mt-8">
          Distances are approximate. Always call ahead to confirm availability.
        </p>
      </div>
    </div>
  );
}