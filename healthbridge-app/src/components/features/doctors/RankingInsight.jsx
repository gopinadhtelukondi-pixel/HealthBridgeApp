function ScoreBar({ label, value }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-ink-mid">{label}</span>
        <span className="font-data font-semibold text-primary">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-bg overflow-hidden">
        <div className="h-full bg-accent" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
    </div>
  )
}

export function RankingInsight({ ranking }) {
  if (!ranking) {
    return (
      <div className="card p-6 text-sm text-ink-muted">
        Ranking insights are loading...
      </div>
    )
  }

  const scores = ranking.scores || {}

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h3 className="font-serif text-xl text-primary font-normal">Smart Ranking</h3>
          <p className="text-xs text-ink-muted mt-1">
            Based on approved patient-reported reviews and profile transparency.
          </p>
        </div>
        <div className="text-center">
          <div className="font-data text-3xl font-bold text-primary">{ranking.trustScore}</div>
          <div className="text-[11px] text-ink-muted uppercase tracking-wide">Trust Score</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {ranking.labels?.map(label => (
          <span key={label} className="tag-pill">{label}</span>
        ))}
      </div>

      <p className="text-sm text-ink-mid leading-relaxed mb-5">{ranking.insight}</p>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-bg rounded-card p-3 text-center">
          <div className="font-data font-semibold text-primary">{ranking.recommendationPercentage}%</div>
          <div className="text-[11px] text-ink-muted">Recommend</div>
        </div>
        <div className="bg-bg rounded-card p-3 text-center">
          <div className="font-data font-semibold text-primary">{ranking.averageWaitingTime} min</div>
          <div className="text-[11px] text-ink-muted">Avg wait</div>
        </div>
        <div className="bg-bg rounded-card p-3 text-center">
          <div className="font-data font-semibold text-primary">{ranking.approvedReviewCount}</div>
          <div className="text-[11px] text-ink-muted">Reviews</div>
        </div>
      </div>

      <div className="space-y-3">
        <ScoreBar label="Patient satisfaction" value={scores.patientSatisfactionScore || 0} />
        <ScoreBar label="Recovery" value={scores.recoveryScore || 0} />
        <ScoreBar label="Communication" value={scores.communicationScore || 0} />
        <ScoreBar label="Affordability" value={scores.affordabilityScore || 0} />
        <ScoreBar label="Waiting time" value={scores.waitingTimeScore || 0} />
      </div>
    </div>
  )
}
