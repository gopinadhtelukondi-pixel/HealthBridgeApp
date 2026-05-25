import { useNavigate } from 'react-router-dom'
import { StarRating } from '@/components/ui/StarRating'
import { Badge } from '@/components/ui/Badge'

export function DoctorCard({ doctor }) {
  const navigate = useNavigate()
  const ranking = doctor.ranking

  const goToDetail = () => navigate(`/doctor/${doctor.id}`)

  return (
    <article
      onClick={goToDetail}
      className="
        card cursor-pointer relative overflow-hidden
        hover:-translate-y-1 hover:shadow-card-lg hover:border-accent
        group
      "
    >
      <div className="
        absolute top-0 left-0 right-0 h-[3px]
        bg-gradient-to-r from-accent to-primary
        scale-x-0 group-hover:scale-x-100
        origin-left transition-transform duration-300
      " />

      <div className="flex gap-3.5 items-start mb-4 p-6 pb-0">
        {doctor.image ? (
          <img
            src={doctor.image}
            alt={doctor.name}
            className="w-14 h-14 rounded-[14px] object-cover flex-shrink-0"
          />
        ) : (
          <div
            className="w-14 h-14 rounded-[14px] flex items-center justify-center font-bold text-lg text-white flex-shrink-0"
            style={{ background: doctor.color }}
          >
            {doctor.initials}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-bold text-[15px] text-ink mb-0.5">{doctor.name}</h3>
            {ranking && (
              <span className="text-[11px] font-data font-bold text-primary bg-accent-dim px-2 py-1 rounded flex-shrink-0">
                {ranking.trustScore}
              </span>
            )}
          </div>
          <p className="text-[13px] text-ink-muted mb-1.5">
            {doctor.spec} · {doctor.hospital}
          </p>
          <StarRating rating={doctor.rating || 0} showNum count={doctor.reviews || 0} />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4 px-6">
        {(doctor.tags || []).map(tag => (
          <span key={tag} className="tag-pill">{tag}</span>
        ))}
        {ranking?.labels?.slice(0, 2).map(label => (
          <span key={label} className="tag-pill">{label}</span>
        ))}
        {doctor.verified && <Badge type="verified">Verified</Badge>}
        {doctor.nabh && <Badge type="nabh">NABH</Badge>}
      </div>

      {ranking && (
        <div className="grid grid-cols-2 gap-2 px-6 mb-4">
          <div className="bg-bg rounded-card p-2">
            <p className="text-[11px] text-ink-muted">Recommend</p>
            <p className="font-data font-semibold text-primary">{ranking.recommendationPercentage}%</p>
          </div>
          <div className="bg-bg rounded-card p-2">
            <p className="text-[11px] text-ink-muted">Avg wait</p>
            <p className="font-data font-semibold text-primary">{ranking.averageWaitingTime} min</p>
          </div>
        </div>
      )}

      <div className="
        flex items-center justify-between
        px-6 pb-6 pt-4
        border-t border-line-light
      ">
        <div>
          <p className="text-xs text-ink-muted">Consultation fee</p>
          <p className="font-bold text-[18px] text-primary">
            Rs {doctor.fee.toLocaleString()}
          </p>
        </div>

        <button
          onClick={e => { e.stopPropagation(); goToDetail() }}
          className="
            bg-primary text-white text-[13px] font-semibold
            px-4 py-2 rounded-lg font-sans
            transition-all duration-200
            hover:bg-accent active:scale-95
          "
        >
          Book Now
        </button>
      </div>
    </article>
  )
}
