import { useNavigate } from 'react-router-dom'
import { formatINR } from '@/utils'

export function RecommendedDoctorCard({ doctor }) {
  const navigate = useNavigate()

  return (
    <article className="card p-5">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h3 className="font-bold text-ink">{doctor.name}</h3>
          <p className="text-sm text-ink-muted">{doctor.spec} · {doctor.hospital} · {doctor.city}</p>
        </div>
        <div className="text-center">
          <div className="font-data text-2xl font-bold text-primary">{doctor.recommendationScore}</div>
          <div className="text-[10px] text-ink-muted uppercase">Match</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {doctor.ranking?.labels?.slice(0, 3).map(label => (
          <span key={label} className="tag-pill">{label}</span>
        ))}
        <span className="tag-pill">{doctor.budgetStatus}</span>
      </div>

      <p className="text-sm text-ink-mid leading-relaxed mb-4">{doctor.recommendationReason}</p>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-bg rounded-card p-2 text-center">
          <div className="font-data font-semibold text-primary">{doctor.ranking?.trustScore}</div>
          <div className="text-[11px] text-ink-muted">Trust</div>
        </div>
        <div className="bg-bg rounded-card p-2 text-center">
          <div className="font-data font-semibold text-primary">{doctor.ranking?.averageWaitingTime} min</div>
          <div className="text-[11px] text-ink-muted">Wait</div>
        </div>
        <div className="bg-bg rounded-card p-2 text-center">
          <div className="font-data font-semibold text-primary">{formatINR(doctor.estimatedCost)}</div>
          <div className="text-[11px] text-ink-muted">Est.</div>
        </div>
      </div>

      <button
        onClick={() => navigate(`/doctor/${doctor.id}`)}
        className="bg-primary text-white text-sm font-semibold px-4 py-2 rounded-lg font-sans hover:bg-accent transition-colors"
      >
        View Doctor
      </button>
    </article>
  )
}
