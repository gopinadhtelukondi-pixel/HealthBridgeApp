import { ReviewCard } from './ReviewCard'

export function ReviewList({ reviews, loading }) {
  if (loading) {
    return (
      <div className="card p-8 text-center text-ink-muted">
        Loading patient reviews...
      </div>
    )
  }

  return (
    <div className="card p-8">
      <div className="flex items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="font-bold text-[16px] text-primary">Patient Reviews</h2>
          <p className="text-xs text-ink-muted mt-1">
            Patient-reported experiences, shown after moderation.
          </p>
        </div>
        <span className="text-sm text-ink-muted">{reviews.length} approved</span>
      </div>

      {reviews.length ? (
        <div className="space-y-4">
          {reviews.map(review => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-ink-muted">
          No approved patient reviews yet.
        </div>
      )}
    </div>
  )
}
