# HealthBridge — Healthcare Transparency & Intelligent Patient Decision Platform

A production-grade React + Vite + Tailwind CSS frontend.

---

## Quick Start

```bash
# 1. Extract the zip and enter the folder
cd healthbridge-app

# 2. Install dependencies
npm install

# 3. Start development server (opens at http://localhost:5173)
npm run dev

# 4. Build for production
npm run build
```

---

## Folder Structure

```
healthbridge-app/
│
├── index.html                        # Entry HTML — loads Google Fonts
├── vite.config.js                    # Vite build config + path aliases
├── tailwind.config.js                # Tailwind design tokens + animations
├── postcss.config.js                 # PostCSS (required by Tailwind)
├── package.json                      # Dependencies
│
└── src/
    ├── main.jsx                      # React entry point
    ├── App.jsx                       # Router setup + layout shell
    ├── index.css                     # Tailwind directives + global styles
    │
    ├── context/
    │   └── AppContext.jsx            # Global state: toast, user, auth
    │
    ├── data/                         # Static mock data (→ replace with API)
    │   ├── doctors.js                # Doctor profiles + SPECIALTIES list
    │   └── index.js                  # Hospitals, emergency, cost, map, metrics
    │
    ├── hooks/                        # Custom React hooks
    │   └── index.js
    │       ├── useSearch()           # Doctor search + filter + sort logic
    │       └── useCostEstimate()     # Cost form state + calculation trigger
    │
    ├── utils/
    │   └── index.js
    │       ├── formatINR()           # ₹280000 → "₹2.8L"
    │       ├── getScoreStroke()      # Score → SVG ring color
    │       └── calculateCostEstimate() # Multiplier math for cost predictor
    │
    ├── components/
    │   │
    │   ├── ui/                       # Atomic, reusable components
    │   │   ├── Button.jsx            # primary / outline / danger / ghost
    │   │   ├── Badge.jsx             # verified / nabh / exp / danger
    │   │   ├── StarRating.jsx        # Gold star display (0–5, supports .5)
    │   │   ├── Toast.jsx             # Notification toasts (slideUp animation)
    │   │   └── Modal.jsx             # Portal overlay dialog
    │   │
    │   ├── layout/                   # App shell components
    │   │   ├── Navbar.jsx            # Sticky nav + emergency button
    │   │   └── Footer.jsx            # Site footer
    │   │
    │   └── features/                 # Domain-specific feature components
    │       ├── doctors/
    │       │   ├── DoctorCard.jsx    # Card in search grid (hover effects)
    │       │   └── DoctorDetail.jsx  # Full profile + calendar booking sidebar
    │       ├── hospitals/
    │       │   └── HospitalCard.jsx  # Card with SVG transparency score ring
    │       ├── emergency/
    │       │   └── EmergencyCard.jsx # Dark-theme emergency facility card
    │       ├── cost/
    │       │   └── CostEstimator.jsx # 4-input form + P10/P50/P90 result bands
    │       └── map/
    │           └── GISMap.jsx        # Mock GIS map with filter + nearby sidebar
    │
    └── pages/                        # Route-level page components
        ├── HomePage.jsx              # Hero + search + featured + transparency
        ├── SearchPage.jsx            # Live filter / sort / search results
        ├── HospitalsPage.jsx         # Hospital listings
        ├── CostPage.jsx              # Cost estimator page (wraps component)
        ├── MapPage.jsx               # GIS map page
        ├── EmergencyPage.jsx         # Dark emergency finder
        └── DoctorDetailPage.jsx      # Profile + booking (reads :id from URL)
```

---

## Tech Stack

| Layer       | Technology                          | Why                                       |
|-------------|-------------------------------------|-------------------------------------------|
| Framework   | React 18                            | Hooks, concurrent features, ecosystem     |
| Build       | Vite 5                              | Instant HMR, fast production builds       |
| Styling     | Tailwind CSS 3                      | Utility-first, zero unused CSS in prod    |
| Routing     | React Router v6                     | URL-based navigation, nested routes       |
| Icons       | Lucide React                        | Consistent, tree-shakable SVG icons       |
| Utilities   | clsx                                | Conditional class composition             |
| Fonts       | Sora + DM Serif Display + JetBrains | Brand-specific typographic hierarchy      |

---

## Design System

All design tokens are in `tailwind.config.js`:

```js
colors: {
  primary: '#0a3d2e'      // Deep forest green — primary actions
  accent:  '#00c97d'      // Electric mint — highlights, CTAs
  bg:      '#f6f4ef'      // Warm off-white — page background
  ink:     '#111a15'      // Near-black text
  danger:  '#c0392b'      // Emergency red
  success: '#0a7a4a'      // Verified green
}
```

---

## Replacing Mock Data with a Real API

Every `src/data/*.js` file is a mock. Replace each export with a
`useQuery` call (React Query) or `useSWR` hook:

```js
// Before (mock):
import { DOCTORS } from '@/data/doctors'

// After (real API):
import { useQuery } from '@tanstack/react-query'
const { data: doctors } = useQuery({
  queryKey: ['doctors'],
  queryFn: () => fetch('/api/v1/doctors').then(r => r.json())
})
```

---

## Environment Variables

Create `.env.local` in the project root:

```env
VITE_API_URL=https://api.healthbridge.in/v1
VITE_MAPS_KEY=your_google_maps_or_maptiler_key
```

Access in code: `import.meta.env.VITE_API_URL`
