import { StarRating } from '@/components/ui/StarRating'

export function ReviewCard({ review, showStatus = false }) {
  const date = new Date(review.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <article className="bg-bg rounded-card p-4 border-l-[3px] border-accent">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
          {review.patientInitials}
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-sm text-ink">{review.patientName}</p>
            {review.verifiedPatient && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-success-bg text-success font-semibold">
                Verified patient
              </span>
            )}
            {showStatus && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-info-bg text-info font-semibold">
                {review.moderationStatus}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <StarRating rating={review.overallRating} />
            <span className="text-xs text-ink-muted">{date}</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-ink-mid leading-relaxed mb-3">{review.reviewText}</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-ink-mid">
        {review.ratings?.communication != null && (
          <span className="bg-bg-card px-2 py-1 rounded border border-line-light">
            Communication: {review.ratings.communication}/5
          </span>
        )}
        {review.ratings?.cost != null && (
          <span className="bg-bg-card px-2 py-1 rounded border border-line-light">
            Cost: {review.ratings.cost}/5
          </span>
        )}
        {review.ratings?.recovery != null && (
          <span className="bg-bg-card px-2 py-1 rounded border border-line-light">
            Recovery: {review.ratings.recovery}/5
          </span>
        )}
        {review.ratings?.waitingTime != null && (
          <span className="bg-bg-card px-2 py-1 rounded border border-line-light">
            Wait: {review.ratings.waitingTime}/5
          </span>
        )}
        {review.ratings?.staffBehavior != null && (
          <span className="bg-bg-card px-2 py-1 rounded border border-line-light">
            Staff: {review.ratings.staffBehavior}/5
          </span>
        )}
        <span className="bg-bg-card px-2 py-1 rounded border border-line-light">
          {review.recommend ? 'Recommended' : 'Not recommended'}
        </span>
      </div>
    </article>
  )
}
