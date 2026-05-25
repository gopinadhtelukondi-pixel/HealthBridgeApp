/*
 * src/pages/AuthPage.jsx
 * ─────────────────────────────────────────────────────────────
 * Dedicated authentication landing page.
 * Shows patient and doctor login/signup options.
 * Only displayed when user is not authenticated.
 * ─────────────────────────────────────────────────────────────
 */
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { PatientAuthModal } from '@/components/auth/PatientAuthModal'
import { DoctorAuthModal } from '@/components/auth/DoctorAuthModal'
import { useApp } from '@/context/AppContext'

export default function AuthPage() {
  const navigate = useNavigate()
  const { currentUser, setAuthenticatedUser } = useApp()
  const [showPatientAuth, setShowPatientAuth] = useState(false)
  const [showDoctorAuth, setShowDoctorAuth] = useState(false)

  // Redirect to role-specific dashboard if already logged in
  if (currentUser) {
    if (currentUser.role === 'admin') {
      return <Navigate to="/admin" replace />
    }

    if (currentUser.role === 'doctor') {
      const doctorId = currentUser.doctorId || currentUser.id || currentUser._id
      return <Navigate to={`/dashboard/${doctorId}`} replace />
    }

    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-bg to-accent/5 flex items-center justify-center px-5">
      <div className="max-w-4xl w-full">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>

          <h1 className="font-serif text-5xl lg:text-6xl text-primary mb-4 font-normal">
            HealthBridge
          </h1>
          <p className="text-xl text-ink-mid mb-2">
            India&apos;s First Healthcare Transparency Platform
          </p>
          <p className="text-ink-muted max-w-2xl mx-auto">
            Transparent outcomes, verified doctors, real cost data, and AI-powered matching — 
            so every medical decision is informed, not guessed.
          </p>
        </div>

        {/* Auth Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Patient Card */}
          <div className="bg-white rounded-2xl p-8 border border-line-light shadow-card hover:shadow-card-lg transition-shadow duration-300">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 mb-6">
              <span className="text-3xl">👤</span>
            </div>

            <h2 className="font-serif text-2xl text-primary mb-3 font-normal">
              For Patients
            </h2>
            <p className="text-ink-mid mb-6 leading-relaxed">
              Find verified doctors, get transparent cost estimates, book appointments, and share your experience through verified reviews.
            </p>

            <ul className="space-y-3 mb-8 text-sm text-ink-muted">
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1">✓</span>
                <span>Search & filter doctors by specialty, ratings, and experience</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1">✓</span>
                <span>Get real cost estimates for treatments</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1">✓</span>
                <span>Write verified reviews and ratings</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1">✓</span>
                <span>Find emergency services nearby</span>
              </li>
            </ul>

            <Button
              size="lg"
              className="w-full"
              onClick={() => setShowPatientAuth(true)}
            >
              Login / Sign up as Patient
            </Button>
          </div>

          {/* Doctor Card */}
          <div className="bg-white rounded-2xl p-8 border border-line-light shadow-card hover:shadow-card-lg transition-shadow duration-300">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 mb-6">
              <span className="text-3xl">👨‍⚕️</span>
            </div>

            <h2 className="font-serif text-2xl text-primary mb-3 font-normal">
              For Doctors
            </h2>
            <p className="text-ink-mid mb-6 leading-relaxed">
              Build your verified profile, showcase your expertise, manage patient reviews, and improve your practice visibility.
            </p>

            <ul className="space-y-3 mb-8 text-sm text-ink-muted">
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1">✓</span>
                <span>Create and manage verified medical profile</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1">✓</span>
                <span>Respond to patient reviews</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1">✓</span>
                <span>Showcase your expertise & credentials</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1">✓</span>
                <span>Build trust with verified credentials</span>
              </li>
            </ul>

            <Button
              size="lg"
              className="w-full"
              onClick={() => setShowDoctorAuth(true)}
            >
              Login / Sign up as Doctor
            </Button>
          </div>
        </div>

        {/* Admin card for moderation access */}
        <div className="bg-white rounded-2xl p-8 border border-line-light shadow-card hover:shadow-card-lg transition-shadow duration-300">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 mb-6">
            <span className="text-3xl">🛡️</span>
          </div>

          <h2 className="font-serif text-2xl text-primary mb-3 font-normal">
            For Admins
          </h2>
          <p className="text-ink-mid mb-6 leading-relaxed">
            Moderate incoming reviews, approve trusted patient feedback, and keep the review feed safe and fair.
          </p>

          <Button
            size="lg"
            className="w-full"
            onClick={() => setAuthenticatedUser({ id: 'admin', name: 'Admin User', role: 'admin', initials: 'AD' })}
          >
            Login as Admin (demo)
          </Button>
        </div>

        {/* Footer Info */}
        <div className="text-center text-sm text-ink-muted">
          <p>
            By signing up, you agree to our{' '}
            <a href="#" className="text-accent hover:text-primary transition-colors">
              Terms of Service
            </a>
            {' '}and{' '}
            <a href="#" className="text-accent hover:text-primary transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>

      {/* Auth Modals */}
      <PatientAuthModal open={showPatientAuth} onClose={() => setShowPatientAuth(false)} />
      <DoctorAuthModal open={showDoctorAuth} onClose={() => setShowDoctorAuth(false)} />
    </div>
  )
}
