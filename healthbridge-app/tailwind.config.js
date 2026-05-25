// tailwind.config.js
// ─────────────────────────────────────────────────────────────
// Tailwind CSS configuration for HealthBridge.
//
// We extend Tailwind's default theme with our brand-specific
// design tokens so we can write class names like:
//   bg-primary, text-accent, border-brand, shadow-card
//
// Content paths tell Tailwind which files to scan for class
// names so unused styles are purged from the production build.
// ─────────────────────────────────────────────────────────────

/** @type {import('tailwindcss').Config} */
export default {
  // ── Files to scan for Tailwind class usage ────────────────
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],

  theme: {
    extend: {
      // ── Brand color palette ───────────────────────────────
      colors: {
        // Primary brand — deep forest green
        primary: {
          DEFAULT: '#0a3d2e',
          light:   '#0f5c44',
          dark:    '#061f17',
        },
        // Accent — electric mint
        accent: {
          DEFAULT: '#00c97d',
          dim:     '#00c97d18',
          hover:   '#00e690',
        },
        // Page backgrounds
        bg: {
          DEFAULT: '#f6f4ef',
          card:    '#ffffff',
          dark:    '#081a13',
        },
        // Text hierarchy
        ink: {
          DEFAULT: '#111a15',
          mid:     '#3d5248',
          muted:   '#7a8f85',
        },
        // Borders
        line: {
          DEFAULT: '#d4ddd9',
          light:   '#e8edeb',
        },
        // Semantic colors
        danger:  { DEFAULT: '#c0392b', bg: '#fdf0ee' },
        warn:    { DEFAULT: '#b8620a', bg: '#fef6ec' },
        success: { DEFAULT: '#0a7a4a', bg: '#ecfaf3' },
        info:    { DEFAULT: '#1a4f8a', bg: '#edf4fc' },
        gold:    '#d4a017',
      },

      // ── Custom fonts ──────────────────────────────────────
      // These are loaded via <link> in index.html from Google Fonts
      fontFamily: {
        sans:  ['Sora', 'Segoe UI', 'sans-serif'],
        serif: ['DM Serif Display', 'Georgia', 'serif'],
        mono:  ['JetBrains Mono', 'Fira Code', 'monospace'],
      },

      // ── Custom border radius ──────────────────────────────
      borderRadius: {
        card: '12px',
        xl2:  '20px',   // used for large cards
      },

      // ── Custom box shadows ────────────────────────────────
      boxShadow: {
        card:    '0 4px 24px rgba(10,61,46,0.10)',
        'card-lg': '0 12px 48px rgba(10,61,46,0.15)',
      },

      // ── Custom animations ─────────────────────────────────
      keyframes: {
        // Red pulse ring on Emergency button
        pulseRed: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(192,57,43,0.45)' },
          '50%':      { boxShadow: '0 0 0 8px rgba(192,57,43,0)' },
        },
        // Online indicator blink
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.25' },
        },
        // Slide up for toasts
        slideUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        // Fade in up for page transitions
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        // Scale in for modal
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.93)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        // Float for hero cards
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        // Map dot pulse for emergency markers
        mapPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255,107,53,0.5)' },
          '50%':      { boxShadow: '0 0 0 10px rgba(255,107,53,0)' },
        },
        // Width expand for score bars
        expandWidth: {
          from: { width: '0%' },
        },
      },
      animation: {
        'pulse-red':    'pulseRed 2s ease-in-out infinite',
        'blink':        'blink 1.5s ease-in-out infinite',
        'slide-up':     'slideUp 0.3s ease both',
        'fade-in-up':   'fadeInUp 0.35s ease both',
        'scale-in':     'scaleIn 0.25s ease both',
        'float':        'float 3s ease-in-out infinite',
        'map-pulse':    'mapPulse 2s ease-in-out infinite',
        'expand-width': 'expandWidth 1s ease both',
      },
    },
  },

  plugins: [],
}
