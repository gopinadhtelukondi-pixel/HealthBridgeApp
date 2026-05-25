/*
 * src/components/layout/Navbar.jsx
 * ─────────────────────────────────────────────────────────────
 * Sticky top navigation bar with blur backdrop.
 *
 * Contains:
 *   - HealthBridge logo → navigates to /
 *   - Page nav links    → highlights the active route
 *   - Emergency button  → pulsing red, navigates to /emergency
 *   - Login + user avatar
 *
 * Uses React Router's <NavLink> for active state styling and
 * <Link> for the logo. useNavigate() for the emergency button.
 * ─────────────────────────────────────────────────────────────
 */
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { Button } from '@/components/ui/Button'

/* Navigation links config — label shown + route path */
const NAV_LINKS = [
  { label: 'Home',           to: '/' },
  { label: 'Find Doctors',   to: '/search' },
  { label: 'AI Recommend',   to: '/recommend' },
  { label: 'Hospitals',      to: '/hospitals' },
  { label: 'Cost Estimator', to: '/cost' },
  { label: 'GIS Map',        to: '/map' },
]

export function Navbar() {
  const { currentUser, loginAsPatient, loginAsDoctor, logout } = useApp()
  const navigate = useNavigate()

  return (
    <nav className="
      sticky top-0 z-[1000]
      bg-bg/95 backdrop-blur-xl
      border-b border-line-light
      px-8 h-16 flex items-center gap-6
    ">
      {/* ── Logo ─────────────────────────────────────────── */}
      <Link
        to="/"
        className="flex items-center gap-2.5 font-bold text-[18px] text-primary no-underline flex-shrink-0"
      >
        {/* Green icon box */}
        <span className="w-9 h-9 rounded-[10px] bg-primary flex items-center justify-center flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2C7.2 2 5 4.2 5 7c0 4 5 11 5 11s5-7 5-11c0-2.8-2.2-5-5-5z" fill="white"/>
            <path d="M8 7h4M10 5v4" stroke="#0a3d2e" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </span>
        HealthBridge
      </Link>

      {/* ── Nav links ─────────────────────────────────────── */}
      <div className="flex gap-0.5 flex-1">
        {NAV_LINKS.map(({ label, to }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}   /* exact match for home only */
            className={({ isActive }) =>
              `px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
               border-none bg-transparent cursor-pointer
               ${isActive
                 ? 'bg-accent-dim text-primary'
                 : 'text-ink-mid hover:bg-accent-dim hover:text-primary'
               }`
            }
          >
            {label}
          </NavLink>
        ))}
        {currentUser?.role === 'patient' && (
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
               border-none bg-transparent cursor-pointer
               ${isActive
                 ? 'bg-accent-dim text-primary'
                 : 'text-ink-mid hover:bg-accent-dim hover:text-primary'
               }`
            }
          >
            My Dashboard
          </NavLink>
        )}
        {currentUser?.role === 'doctor' && currentUser.doctorId && (
          <NavLink
            to={`/dashboard/${currentUser.doctorId}`}
            className={({ isActive }) =>
              `px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
               border-none bg-transparent cursor-pointer
               ${isActive
                 ? 'bg-accent-dim text-primary'
                 : 'text-ink-mid hover:bg-accent-dim hover:text-primary'
               }`
            }
          >
            Dashboard
          </NavLink>
        )}
        {currentUser?.role === 'admin' && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
               border-none bg-transparent cursor-pointer
               ${isActive
                 ? 'bg-accent-dim text-primary'
                 : 'text-ink-mid hover:bg-accent-dim hover:text-primary'
               }`
            }
          >
            Admin
          </NavLink>
        )}
      </div>

      {/* ── Right: emergency + auth ───────────────────────── */}
      <div className="flex items-center gap-2.5">
        <Button
          variant="danger"
          size="sm"
          onClick={() => navigate('/emergency')}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M6.5 1v11M1 6.5h11" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
          Emergency
        </Button>

        {!currentUser ? (
          <>
            <Button variant="outline" size="sm" onClick={loginAsPatient}>
              Patient login
            </Button>
            <Button variant="outline" size="sm" onClick={loginAsDoctor}>
              Doctor login
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" size="sm" onClick={logout}>
              Logout
            </Button>
            <div className="
              w-9 h-9 rounded-full bg-primary text-white
              flex items-center justify-center
              text-[13px] font-bold cursor-pointer flex-shrink-0
            " title={`${currentUser.name} (${currentUser.role})`}>
              {currentUser.initials}
            </div>
          </>
        )}
      </div>
    </nav>
  )
}
