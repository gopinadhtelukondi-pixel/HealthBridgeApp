/*
 * src/pages/SearchPage.jsx
 * ─────────────────────────────────────────────────────────────
 * Doctor search page (API-powered via useSearch hook)
 */

import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useSearch } from "@/hooks";
import { DoctorCard } from "@/components/features/doctors/DoctorCard";

export default function SearchPage() {
  const [searchParams] = useSearchParams();

  const {
    query,
    setQuery,
    specialty,
    setSpecialty,
    sortBy,
    setSortBy,
    results
  } = useSearch();

  // 🔗 Sync URL params → state
  useEffect(() => {
    const q = searchParams.get("q") || "";
    const spec = searchParams.get("spec") || "";

    if (q) setQuery(q);
    if (spec) setSpecialty(spec);
  }, [searchParams, setQuery, setSpecialty]); // FIX: include hook dependencies for lint-safe URL sync.

  // ✅ Dynamic specialties from API data
  const specialties = [...new Set(results.map((d) => d.spec))];

  return (
    <div className="max-w-6xl mx-auto px-8 py-10 page-enter">

      {/* ── Filter Bar ───────────────────────── */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">

        {/* 🔍 Search Input */}
        <div className="flex-1 min-w-[220px] flex items-center gap-2 bg-bg-card border-[1.5px] border-line rounded-lg px-4 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition-all">
          <svg className="w-4 h-4 text-ink-muted flex-shrink-0" fill="none" viewBox="0 0 20 20">
            <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search doctor, specialty, condition..."
            className="flex-1 border-none bg-transparent font-sans text-sm text-ink outline-none py-3 placeholder:text-ink-muted"
          />
        </div>

        {/* 🏥 Specialty Dropdown */}
        <select
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          className="input-field w-auto"
        >
          <option value="">All Specialties</option>
          {specialties.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        {/* 🔄 Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="input-field w-auto"
        >
          <option value="trust">Smart Trust Score</option>
          <option value="affordable">Best Affordable</option>
          <option value="communication">Best Communication</option>
          <option value="recovery">Best Recovery</option>
          <option value="waitingTime">Shortest Waiting Time</option>
          <option value="recommended">Most Recommended</option>
          <option value="rating">Highest Rated</option>
          <option value="fee-low">Fee: Low → High</option>
          <option value="fee-high">Fee: High → Low</option>
          <option value="reviews">Most Reviews</option>
        </select>
      </div>

      {/* 📊 Result Count */}
      <p className="text-sm text-ink-muted mb-5">
        {results.length} doctor{results.length !== 1 ? "s" : ""} found
      </p>

      {/* 🧑‍⚕️ Results Grid */}
      {results.length > 0 ? (
        <div className="cards-grid">
          {results.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-ink-muted">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-[16px]">
            No doctors found. Try a different search or specialty.
          </p>
        </div>
      )}
    </div>
  );
}
