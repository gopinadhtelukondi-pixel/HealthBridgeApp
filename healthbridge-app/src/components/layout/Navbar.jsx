import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { Button } from '@/components/ui/Button'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Find Doctors', to: '/search' },
  { label: 'AI Recommend', to: '/recommend' },
  { label: 'Hospitals', to: '/hospitals' },
  { label: 'Cost Estimator', to: '/cost' },
  { label: 'GIS Map', to: '/map' },
]

const navLinkClass = ({ isActive }) =>
  `px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200
   border-none bg-transparent cursor-pointer
   ${isActive
     ? 'bg-accent-dim text-primary'
     : 'text-ink-mid hover:bg-accent-dim hover:text-primary'
   }`

function NavItems({ currentUser }) {
  return (
    <>
      {NAV_LINKS.map(({ label, to }) => (
        <NavLink key={to} to={to} end={to === '/'} className={navLinkClass}>
          {label}
        </NavLink>
      ))}

      {currentUser?.role === 'patient' && (
        <NavLink to="/dashboard" className={navLinkClass}>
          My Dashboard
        </NavLink>
      )}

      {currentUser?.role === 'doctor' && currentUser.doctorId && (
        <NavLink to={`/dashboard/${currentUser.doctorId}`} className={navLinkClass}>
          Dashboard
        </NavLink>
      )}

      {currentUser?.role === 'admin' && (
        <NavLink to="/admin" className={navLinkClass}>
          Admin
        </NavLink>
      )}
    </>
  )
}

export function Navbar() {
  const { currentUser, loginAsPatient, loginAsDoctor, logout } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  return (
    <>
      <nav
        className="
          sticky top-0 z-[1000]
          bg-bg/95 backdrop-blur-xl
          border-b border-line-light
          px-4 sm:px-6 lg:px-8 min-h-16
          flex items-center gap-3 sm:gap-4
        "
      >
        <Link
          to="/"
          className="flex min-w-0 items-center gap-2.5 font-bold text-base sm:text-[18px] text-primary no-underline"
        >
          <span className="w-9 h-9 rounded-[10px] bg-primary flex items-center justify-center flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2C7.2 2 5 4.2 5 7c0 4 5 11 5 11s5-7 5-11c0-2.8-2.2-5-5-5z" fill="white" />
              <path d="M8 7h4M10 5v4" stroke="#0a3d2e" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
          <span className="truncate">HealthBridge</span>
        </Link>

        <div className="hidden lg:flex gap-0.5 flex-1 min-w-0">
          <NavItems currentUser={currentUser} />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="danger"
            size="sm"
            className="px-2.5 sm:px-3.5"
            onClick={() => navigate('/emergency')}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M6.5 1v11M1 6.5h11" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
            <span className="hidden sm:inline">Emergency</span>
          </Button>

          {!currentUser ? (
            <div className="hidden lg:flex items-center gap-2.5">
              <Button variant="outline" size="sm" onClick={loginAsPatient}>
                Patient login
              </Button>
              <Button variant="outline" size="sm" onClick={loginAsDoctor}>
                Doctor login
              </Button>
            </div>
          ) : (
            <>
              <Button variant="outline" size="sm" className="hidden sm:inline-flex" onClick={logout}>
                Logout
              </Button>
              <div
                className="
                  w-9 h-9 rounded-full bg-primary text-white
                  flex items-center justify-center
                  text-[13px] font-bold cursor-pointer flex-shrink-0
                "
                title={`${currentUser.name} (${currentUser.role})`}
              >
                {currentUser.initials}
              </div>
            </>
          )}

          <button
            type="button"
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-line-light bg-white/80 text-primary"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              {mobileMenuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <>
                  <path d="M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M4 12h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-line-light bg-bg/98 backdrop-blur-xl">
          <div className="px-4 py-4 flex flex-col gap-2">
            <NavItems currentUser={currentUser} />

            {!currentUser ? (
              <div className="grid grid-cols-1 gap-2 pt-3 mt-2 border-t border-line-light">
                <Button variant="outline" size="sm" fullWidth onClick={loginAsPatient}>
                  Patient login
                </Button>
                <Button variant="outline" size="sm" fullWidth onClick={loginAsDoctor}>
                  Doctor login
                </Button>
              </div>
            ) : (
              <div className="pt-3 mt-2 border-t border-line-light">
                <Button variant="outline" size="sm" fullWidth onClick={logout}>
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
