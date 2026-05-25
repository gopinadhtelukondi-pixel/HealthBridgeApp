/*
 * src/components/ui/StarRating.jsx
 * ─────────────────────────────────────────────────────────────
 * Renders gold star characters for a 0–5 rating value.
 * Supports 0.5 increments (shows a dimmed half-star).
 *
 * Props:
 *   rating   number  — 0.0 to 5.0
 *   showNum  boolean — display the numeric value next to stars
 *   count    number  — review count shown in parentheses
 *   size     'sm' | 'md'
 *
 * Usage:
 *   <StarRating rating={4.9} showNum count={312} />
 * ─────────────────────────────────────────────────────────────
 */
export function StarRating({ rating, showNum = false, count, size = 'sm' }) {
  const full     = Math.floor(rating)
  const half     = rating % 1 >= 0.5
  const empty    = 5 - full - (half ? 1 : 0)
  const textSize = size === 'md' ? 'text-base' : 'text-[13px]'

  return (
    <span className="inline-flex items-center gap-1">
      <span className={`text-gold tracking-wide ${textSize}`}>
        {'★'.repeat(full)}
        {half && <span className="opacity-40">★</span>}
        {'☆'.repeat(empty)}
      </span>
      {showNum && (
        <span className={`font-bold text-ink ${textSize}`}>{rating}</span>
      )}
      {count != null && (
        <span className="text-xs text-ink-muted">({count.toLocaleString()})</span>
      )}
    </span>
  )
}
