/*
 * src/components/features/emergency/EmergencyCard.jsx
 * ─────────────────────────────────────────────────────────────
 * Card shown on the Emergency page for each nearby facility.
 * Dark background variant — sits on the emergency page's dark bg.
 *
 * Props:
 *   facility — emergency facility object from EMERGENCY_FACILITIES
 * ─────────────────────────────────────────────────────────────
 */
import { useApp } from '@/context/AppContext'

export function EmergencyCard({ facility }) {
  const { addToast } = useApp()

  return (
    <article className="
      bg-white/5 border border-white/10 rounded-xl2 p-5
      cursor-pointer transition-all duration-200
      hover:bg-accent/10 hover:border-accent hover:-translate-y-1
    ">
      {/* Header: icon + name + type */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-11 h-11 rounded-xl bg-accent/90 flex items-center justify-center text-xl flex-shrink-0">
          {facility.icon}
        </div>
        <div>
          <h3 className="font-bold text-[15px] text-white">{facility.name}</h3>
          <p className="text-xs text-white/60">{facility.type}</p>
        </div>
      </div>

      {/* Distance badge */}
      <span className="inline-block bg-accent/15 text-accent rounded px-2.5 py-0.5 text-xs font-semibold mb-2.5">
        📍 {facility.dist} · ~{facility.time}
      </span>

      {/* Bed count info */}
      <p className="text-[13px] text-white/70 mb-4">
        {facility.beds} emergency beds available · Open 24/7
      </p>

      {/* Call button */}
      <button
        onClick={() => addToast(`Calling ${facility.name}…`, 'success')}
        className="
          w-full bg-danger text-white font-bold text-sm
          py-2.5 rounded-lg font-sans
          flex items-center justify-center gap-2
          transition-all duration-200 hover:bg-[#a93226] active:scale-[0.98]
          cursor-pointer border-none
        "
      >
        📞 Call {facility.phone}
      </button>
    </article>
  )
}
