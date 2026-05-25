/*
 * src/App.jsx
 * ─────────────────────────────────────────────────────────────
 * Root component. Sets up:
 *   1. AppProvider   — global state (toast, navigation, user)
 *   2. React Router  — URL-based page routing
 *   3. Layout shell  — Navbar + page content + Footer
 *   4. ToastContainer— global notification layer
 *
 * Route map:
 *   /              → HomePage
 *   /search        → SearchPage       (doctor search + filter)
 *   /hospitals     → HospitalsPage    (hospital listings)
 *   /cost          → CostPage         (cost estimator)
 *   /map           → MapPage          (GIS healthcare map)
 *   /emergency     → EmergencyPage    (emergency finder)
 *   /doctor/:id    → DoctorDetailPage (full profile + booking)
 * ─────────────────────────────────────────────────────────────
 */
import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from '@/context/AppContext'
import { Navbar }     from '@/components/layout/Navbar'
import { Footer }     from '@/components/layout/Footer'
import { ToastContainer } from '@/components/ui/Toast'

// Pages — lazy imports improve initial bundle size
import AuthPage         from '@/pages/AuthPage'
import HomePage         from '@/pages/HomePage'
import SearchPage       from '@/pages/SearchPage'
import HospitalsPage    from '@/pages/HospitalsPage'
import CostPage         from '@/pages/CostPage'
import RecommendationPage from '@/pages/RecommendationPage'
import MapPage          from '@/pages/MapPage'
import EmergencyPage    from '@/pages/EmergencyPage'
import DoctorDetailPage from '@/pages/DoctorDetailPage'
import PatientDashboardPage from '@/pages/PatientDashboardPage'
import DoctorDashboardPage from '@/pages/DoctorDashboardPage'
import AdminPage        from '@/pages/AdminPage'
import { useApp } from '@/context/AppContext'

function AppRoutes() {
  const { currentUser } = useApp()

  return (
    <BrowserRouter>
      {currentUser ? (
        /* Authenticated user — show full layout */
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/"           element={<HomePage />}         />
              <Route path="/search"     element={<SearchPage />}       />
              <Route path="/hospitals"  element={<HospitalsPage />}    />
              <Route path="/recommend"  element={<RecommendationPage />} />
              <Route path="/cost"       element={<CostPage />}         />
              <Route path="/map"        element={<MapPage />}          />
              <Route path="/emergency"  element={<EmergencyPage />}    />
              <Route path="/doctor/:id" element={<DoctorDetailPage />} />
              <Route path="/dashboard" element={<PatientDashboardPage />} />
              <Route path="/dashboard/:doctorId" element={<DoctorDashboardPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      ) : (
        /* Unauthenticated user — show auth page */
        <main>
          <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      )}
      <ToastContainer />
    </BrowserRouter>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  )
}
