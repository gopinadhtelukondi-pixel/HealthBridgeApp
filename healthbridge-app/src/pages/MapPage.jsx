/*
 * src/pages/MapPage.jsx
 * ─────────────────────────────────────────────────────────────
 * GIS Healthcare Intelligence map page.
 * Thin wrapper around the GISMap feature component.
 *
 * Production upgrade: embed MapLibre GL JS here with real
 * PostGIS tile server endpoint and live facility data.
 * ─────────────────────────────────────────────────────────────
 */
import { GISMap } from '@/components/features/map/GISMap'

export default function MapPage() {
  return (
    <div className="max-w-6xl mx-auto px-8 py-10 page-enter">
      <div className="mb-6">
        <h1 className="font-serif text-4xl text-primary font-normal mb-2">
          GIS Healthcare Intelligence
        </h1>
        <p className="text-ink-mid text-[15px]">
          Real-time spatial mapping of healthcare facilities, doctor density,
          and emergency services near you. Filter by type or click any marker
          for facility details.
        </p>
      </div>

      {/* GIS map with filter controls and nearby sidebar */}
      <GISMap />

      {/* Info strip below map */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: '🗺️', title: 'Coverage gap analysis', desc: 'H3 hexagonal indexing identifies healthcare deserts at district level' },
          { icon: '🏃', title: 'Isochrone routing',     desc: '15/30/60-minute drive-time polygons around every emergency facility' },
          { icon: '🔬', title: 'Disease hotspots',      desc: 'IDSP outbreak data overlaid with facility density for rapid response' },
        ].map(c => (
          <div key={c.title} className="card p-5">
            <span className="text-2xl mb-2 block">{c.icon}</span>
            <h3 className="font-semibold text-sm text-ink mb-1">{c.title}</h3>
            <p className="text-xs text-ink-muted leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
