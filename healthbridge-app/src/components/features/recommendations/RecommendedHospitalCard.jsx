export function RecommendedHospitalCard({ hospital }) {
  return (
    <article className="card p-5">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h3 className="font-bold text-ink">{hospital.name}</h3>
          <p className="text-sm text-ink-muted">{hospital.type} · {hospital.city}</p>
        </div>
        <div className="text-center">
          <div className="font-data text-2xl font-bold text-primary">{hospital.recommendationScore}</div>
          <div className="text-[10px] text-ink-muted uppercase">Match</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {hospital.emergency && <span className="badge badge-danger">Emergency</span>}
        <span className="badge badge-nabh">{hospital.accreditation || 'Accreditation not listed'}</span>
        <span className="tag-pill">Transparency {hospital.transparencyScore}</span>
      </div>

      <p className="text-sm text-ink-mid leading-relaxed mb-4">{hospital.recommendationReason}</p>

      <div className="flex flex-wrap gap-1.5">
        {(hospital.departments || []).map(dept => (
          <span key={dept} className="tag-pill">{dept}</span>
        ))}
      </div>
    </article>
  )
}
