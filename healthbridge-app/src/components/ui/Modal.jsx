/*
 * src/components/ui/Modal.jsx
 * ─────────────────────────────────────────────────────────────
 * Accessible overlay modal dialog.
 * Clicking the backdrop calls onClose.
 * Uses React Portal so it renders at document.body level,
 * above all other stacking contexts (z-[2000]).
 *
 * Props:
 *   open     boolean   — controlled open/close state
 *   onClose  function  — called on backdrop click
 *   title    string    — modal heading (optional)
 *   children ReactNode — modal body content
 * ─────────────────────────────────────────────────────────────
 */
import { createPortal } from 'react-dom'

export function Modal({ open, onClose, title, children }) {
  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 z-[2000] flex items-end sm:items-center justify-center p-0 sm:p-5"
      onClick={onClose}
    >
      <div
        // Keep auth forms usable on short mobile screens without horizontal clipping.
        className="bg-bg-card w-full sm:max-w-[560px] rounded-t-[24px] sm:rounded-xl2 p-5 sm:p-9 max-h-[92dvh] overflow-y-auto overscroll-contain shadow-card-lg animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        {title && (
          <h3 className="font-serif text-[28px] sm:text-2xl text-primary font-normal mb-3">
            {title}
          </h3>
        )}
        {children}
      </div>
    </div>,
    document.body,
  )
}
