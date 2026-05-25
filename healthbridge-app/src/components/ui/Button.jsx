/*
 * src/components/ui/Button.jsx
 * ─────────────────────────────────────────────────────────────
 * Reusable button component with variant + size support.
 *
 * Variants:
 *   primary   — solid forest-green background
 *   outline   — transparent with border
 *   danger    — solid red + pulsing ring (Emergency CTA)
 *   ghost     — subtle grey border
 *
 * Sizes:
 *   sm  — compact (nav, badges)
 *   md  — default
 *   lg  — hero CTAs
 *
 * Usage:
 *   <Button variant="primary" size="lg" onClick={handleClick}>
 *     Find a Doctor
 *   </Button>
 * ─────────────────────────────────────────────────────────────
 */
import { clsx } from 'clsx'

const variantClasses = {
  primary: 'bg-primary text-white hover:bg-primary-light active:scale-[0.98]',
  outline: 'bg-transparent text-primary border-[1.5px] border-primary hover:bg-primary hover:text-white',
  danger:  'bg-danger text-white animate-pulse-red hover:bg-[#a93226] active:scale-[0.98]',
  ghost:   'bg-transparent text-ink-mid border-[1.5px] border-line hover:border-primary hover:text-primary',
}

const sizeClasses = {
  sm: 'px-3.5 py-1.5 text-[13px]',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-8 py-3.5 text-base',
}

export function Button({
  variant  = 'primary',
  size     = 'md',
  onClick,
  children,
  fullWidth = false,
  disabled  = false,
  className = '',
  type      = 'button',
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        // Base styles applied to all variants
        'inline-flex items-center justify-center gap-2',
        'font-sans font-semibold rounded-lg',
        'transition-all duration-200 cursor-pointer whitespace-nowrap',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className,
      )}
    >
      {children}
    </button>
  )
}
