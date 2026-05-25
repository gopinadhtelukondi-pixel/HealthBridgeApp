/*
 * src/components/ui/Toast.jsx
 * ─────────────────────────────────────────────────────────────
 * Global toast notification container.
 * Fixed to the bottom-right corner, renders above all content.
 * Reads the toasts array from AppContext via useApp().
 *
 * Toast types:
 *   ''        → dark (neutral info)
 *   'success' → green
 *   'error'   → red
 * ─────────────────────────────────────────────────────────────
 */
import { useApp } from '@/context/AppContext'

const bgMap = {
  success: 'bg-success',
  error:   'bg-danger',
  '':      'bg-ink',
}

export function Toast({ type = '', message, onClose }) {
  return (
    <div
      className={`
        ${bgMap[type] ?? bgMap['']}
        text-white px-5 py-3 rounded-card text-sm font-medium
        shadow-card-lg animate-slide-up max-w-sm leading-snug
      `}
      role="status"
    >
      <div className="flex items-start justify-between gap-4">
        <span>{message}</span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-white opacity-80 hover:opacity-100 focus:outline-none"
            aria-label="Dismiss notification"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}

export function ToastContainer() {
  const { toasts } = useApp()

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <Toast key={t.id} type={t.type} message={t.message} />
      ))}
    </div>
  )
}

export default Toast
