/*
 * src/components/ui/Badge.jsx
 * ─────────────────────────────────────────────────────────────
 * Small colored label pill shown on doctor and hospital cards.
 *
 * type prop maps to a Tailwind color scheme:
 *   verified → green
 *   nabh     → blue
 *   exp      → orange
 *   danger   → red
 *   default  → grey
 *
 * Usage:
 *   <Badge type="verified">✓ NMC Verified</Badge>
 * ─────────────────────────────────────────────────────────────
 */
import { clsx } from 'clsx'

const typeClasses = {
  verified: 'bg-success-bg text-success',
  nabh:     'bg-info-bg text-info',
  exp:      'bg-warn-bg text-warn',
  danger:   'bg-danger-bg text-danger',
  default:  'bg-bg text-ink-mid',
}

export function Badge({ type = 'default', children, className = '' }) {
  return (
    <span className={clsx(
      'inline-flex items-center gap-1 rounded-[6px] px-2 py-0.5 text-[11px] font-semibold',
      typeClasses[type] ?? typeClasses.default,
      className,
    )}>
      {children}
    </span>
  )
}

/*
 * src/components/ui/StarRating.jsx
 * ─────────────────────────────────────────────────────────────
 * Renders gold star characters for a 0–5 rating value.
 * Supports 0.5 increments (shows a dimmed half-star).
 *
 * Props:
 *   rating   number  — 0.0 to 5.0
 *   showNum  boolean — display the numeric value
 *   count    number  — review count shown in parentheses
 *   size     'sm' | 'md'
 * ─────────────────────────────────────────────────────────────
 */
export function StarRating({ rating, showNum = false, count, size = 'sm' }) {
  const full  = Math.floor(rating)
  const half  = rating % 1 >= 0.5
  const empty = 5 - full - (half ? 1 : 0)
  const textSize = size === 'md' ? 'text-base' : 'text-[13px]'

  return (
    <span className="inline-flex items-center gap-1">
      {/* Star characters */}
      <span className={clsx('text-gold tracking-wide', textSize)}>
        {'★'.repeat(full)}
        {half && <span className="opacity-50">★</span>}
        {'☆'.repeat(empty)}
      </span>

      {/* Numeric value */}
      {showNum && (
        <span className={clsx('font-bold text-ink', textSize)}>{rating}</span>
      )}

      {/* Review count */}
      {count != null && (
        <span className="text-xs text-ink-muted">
          ({count.toLocaleString()})
        </span>
      )}
    </span>
  )
}

/*
 * src/components/ui/Modal.jsx
 * ─────────────────────────────────────────────────────────────
 * Accessible overlay modal dialog.
 * Clicking the backdrop calls onClose.
 * Rendered as a React portal at the document body level
 * so it sits above all other content (z-[2000]).
 *
 * Props:
 *   open     boolean  — controlled open/close state
 *   onClose  function — called on backdrop click or cancel
 *   title    string   — modal heading (optional)
 *   children ReactNode— modal body content
 * ─────────────────────────────────────────────────────────────
 */
import { createPortal } from 'react-dom'

export function Modal({ open, onClose, title, children }) {
  if (!open) return null

  return createPortal(
    // Backdrop — click outside to close
    <div
      className="fixed inset-0 bg-black/50 z-[2000] flex items-center justify-center p-5"
      onClick={onClose}
    >
      {/* Modal panel — stop propagation so inner click doesn't close */}
      <div
        className="bg-bg-card rounded-xl2 p-9 max-w-[480px] w-full shadow-card-lg animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        {title && (
          <h3 className="font-serif text-2xl text-primary font-normal mb-3">
            {title}
          </h3>
        )}
        {children}
      </div>
    </div>,
    document.body,
  )
}
