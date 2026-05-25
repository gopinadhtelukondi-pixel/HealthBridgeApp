/*
 * src/components/features/hospitals/HospitalCard.jsx
 * ─────────────────────────────────────────────────────────────
 * Hospital listing card with SVG transparency score ring.
 *
 * The transparency score is an AI-computed composite (0–100)
 * calculated nightly from verified patient outcomes, cost
 * accuracy, communication ratings, and facility scores.
 *
 * Props:
 *   hospital — hospital object from HOSPITALS data array
 * ─────────────────────────────────────────────────────────────
 */
import { useApp } from '@/context/AppContext'
import { getScoreStroke } from '@/utils'

/* SVG ring that visually represents the transparency score */
function ScoreRing({ score }) {
  const radius      = 28
  const circumference = 2 * Math.PI * radius
  const strokeDash  = circumference - (score / 100) * circumference
  const color       = getScoreStroke(score)

  return (
    <div className="text-center">
      {/* Ring SVG */}
      <div className="relative w-[68px] h-[68px]">
        <svg
          width="68" height="68" viewBox="0 0 68 68"
          className="-rotate-90"      /* rotate so fill starts from top */
        >
          {/* Background track */}
          <circle cx="34" cy="34" r={radius} fill="none" stroke="#e8edeb" strokeWidth="5" />
          {/* Colored fill arc */}
          <circle
            cx="34" cy="34" r={radius} fill="none"
            stroke={color} strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDash}
            strokeLinecap="round"
          />
        </svg>

        {/* Numeric score overlaid in the center */}
        <div className="absolute inset-0 flex items-center justify-center font-bold text-[18px] text-primary">
          {score}
        </div>
      </div>

      <p className="text-[11px] text-ink-muted mt-1 leading-tight">
        Transparency<br />Score
      </p>
    </div>
  )
}

export function HospitalCard({ hospital }) {
  const { addToast } = useApp()

  return (
    <article
      onClick={() => addToast(`Viewing ${hospital.name} details`, 'success')}
      className="
        card grid grid-cols-[1fr_auto] gap-4 p-6
        cursor-pointer items-start
        hover:-translate-y-1 hover:shadow-card-lg hover:border-primary
        transition-all duration-200
      "
    >
      {/* ── Left: hospital info ──────────────────────────── */}
      <div className="flex items-start gap-4 mb-4">
        {hospital.logo ? (
          <img src={hospital.logo} alt={hospital.name} className="w-14 h-14 rounded-[14px] object-cover border border-line" />
        ) : (
          <div className="w-14 h-14 rounded-[14px] bg-slate-100 border border-line flex items-center justify-center text-sm text-ink-muted">
            Logo
          </div>
        )}
        <div>
          <h3 className="font-bold text-[16px] text-ink mb-1">{hospital.name}</h3>
          <p className="text-xs text-ink-muted mb-3">
            {hospital.type} · Est. {hospital.established}
          </p>
        </div>
      </div>

      {/* Tags row: emergency + accreditation */}
      <div className="flex flex-wrap gap-2 mb-3">
        {hospital.emergency && (
          <span className="badge badge-danger">🚨 24/7 Emergency</span>
        )}
        <span className="badge badge-nabh">{hospital.accreditation}</span>
      </div>

      {/* Stats: beds, doctors, departments */}
      <div className="flex gap-5 mb-3">
        {[
          { num: hospital.beds,               lbl: 'Beds' },
          { num: hospital.doctors,            lbl: 'Doctors' },
          { num: hospital.departments.length, lbl: 'Depts' },
        ].map(s => (
          <div key={s.lbl} className="text-center">
            <div className="font-data text-[18px] font-medium text-primary">{s.num}</div>
            <div className="text-[11px] text-ink-muted">{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* Department tags */}
      <div className="flex flex-wrap gap-1.5">
        {hospital.departments.map(d => (
          <span key={d} className="tag-pill">{d}</span>
        ))}
      </div>

      {/* ── Right: transparency score ring ──────────────── */}
      <ScoreRing score={hospital.transparencyScore} />
    </article>
  )
}
