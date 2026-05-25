/*
 * src/components/features/doctors/DoctorDetail.jsx
 * ─────────────────────────────────────────────────────────────
 * Full doctor profile layout used by DoctorDetailPage.
 *
 * Layout:
 *   Left (2/3)  — bio, metrics, verified patient reviews
 *   Right (1/3) — sticky booking card: calendar + time slots
 *
 * Props:
 *   doctor — doctor object (from DOCTORS, found by id)
 * ─────────────────────────────────────────────────────────────
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useApp } from '@/context/AppContext'

/* ── Helper: generate 3-week calendar from today ──────────── */
function buildCalendar() {
  const today  = new Date()
  const days   = []
  const start  = new Date(today)
  start.setDate(today.getDate() - today.getDay())   // align to Sunday

  for (let w = 0; w < 3; w++) {
    for (let d = 0; d < 7; d++) {
      const day = new Date(start)
      day.setDate(start.getDate() + w * 7 + d)
      days.push({
        date:    day,
        label:   day.getDate(),
        isToday: day.toDateString() === today.toDateString(),
        isPast:  day < today && day.toDateString() !== today.toDateString(),
        display: day.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      })
    }
  }
  return days
}

const TIME_SLOTS = ['9:00 AM','9:30 AM','10:00 AM','11:00 AM','11:30 AM','2:00 PM','3:00 PM','4:00 PM']
const BOOKED     = new Set(['10:00 AM'])   // mock booked slots
const DAY_LABELS = ['Su','Mo','Tu','We','Th','Fr','Sa']

export function DoctorDetail({ doctor, reviewSection }) {
  const navigate       = useNavigate()
  const { addToast }   = useApp()
  const [selDate, setSelDate] = useState(null)
  const [selTime, setSelTime] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  const calendar = buildCalendar()

  function handleConfirm() {
    setModalOpen(false)
    addToast(`Appointment confirmed! SMS sent to ${doctor.name.split(' ')[1]}.`, 'success')
    setSelDate(null)
    setSelTime(null)
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-10">
      {/* Back link */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-ink-mid text-sm mb-7 hover:text-primary transition-colors bg-transparent border-none cursor-pointer font-sans"
      >
        ← Back to results
      </button>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">

        {/* ── LEFT: Profile + reviews ───────────────────── */}
        <div className="space-y-6">

          {/* Profile card */}
          <div className="card p-8">
            <div className="flex gap-5 items-start mb-6">
              {/* Avatar */}
            {doctor.image ? (
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-[88px] h-[88px] rounded-[20px] object-cover flex-shrink-0"
              />
            ) : (
              <div
                className="w-[88px] h-[88px] rounded-[20px] flex items-center justify-center font-bold text-[28px] text-white flex-shrink-0"
                style={{ background: doctor.color }}
              >
                {doctor.initials}
              </div>
            )}

            <div>
                <h1 className="font-serif text-[28px] text-primary font-normal mb-1">
                  {doctor.name}
                </h1>
                <p className="text-[16px] text-ink-mid mb-3">
                  {doctor.spec} · {doctor.hospital} · {doctor.city}
                </p>
                <div className="flex flex-wrap gap-2">
                  {doctor.verified && <Badge type="verified">✓ NMC Verified</Badge>}
                  {doctor.nabh     && <Badge type="nabh">NABH Accredited</Badge>}
                  <Badge type="exp">{doctor.exp} yrs experience</Badge>
                </div>
              </div>
            </div>

            {/* 4-metric row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {[
                { num: doctor.rating,                   lbl: 'Avg rating' },
                { num: (doctor.reviews || 0).toLocaleString(), lbl: 'Verified reviews' },
                { num: `₹${doctor.fee.toLocaleString()}`, lbl: 'Consult fee' },
                { num: `${doctor.exp} yr`,              lbl: 'Experience' },
              ].map(m => (
                <div key={m.lbl} className="bg-bg rounded-card p-4 text-center">
                  <div className="font-data text-[22px] font-medium text-primary">{m.num}</div>
                  <div className="text-[11px] text-ink-muted mt-0.5">{m.lbl}</div>
                </div>
              ))}
            </div>

            {/* Bio */}
            <div className="mb-5">
              <h4 className="text-sm font-semibold text-ink-mid uppercase tracking-wide mb-2">About</h4>
              <p className="text-ink-mid leading-relaxed text-sm">{doctor.bio}</p>
            </div>

            {/* Education */}
            <div>
              <h4 className="text-sm font-semibold text-ink-mid uppercase tracking-wide mb-2">Education</h4>
              <p className="text-ink-mid text-sm">{doctor.education}</p>
            </div>
          </div>

          {reviewSection}
        </div>

        {/* ── RIGHT: Booking sidebar ────────────────────── */}
        <div className="card p-6 sticky top-[80px]">
          <h3 className="font-serif text-xl text-primary font-normal mb-5">
            Book Appointment
          </h3>

          {/* Calendar day-of-week headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAY_LABELS.map(d => (
              <div key={d} className="text-center text-[10px] font-semibold text-ink-muted uppercase">{d}</div>
            ))}
          </div>

          {/* Calendar day cells */}
          <div className="grid grid-cols-7 gap-1 mb-5">
            {calendar.map((day, i) => (
              <button
                key={i}
                disabled={day.isPast}
                onClick={() => !day.isPast && setSelDate(day.display)}
                className={`
                  aspect-square rounded-lg flex items-center justify-center
                  text-[13px] font-medium transition-all duration-150
                  border-[1.5px] font-sans
                  ${day.isPast
                    ? 'text-ink-muted opacity-30 cursor-not-allowed border-transparent bg-transparent'
                    : selDate === day.display
                      ? 'bg-primary text-white border-primary'
                      : day.isToday
                        ? 'border-accent text-accent bg-transparent cursor-pointer hover:bg-accent-dim'
                        : 'border-transparent text-ink-mid bg-transparent cursor-pointer hover:bg-accent-dim hover:text-primary hover:border-accent'
                  }
                `}
              >
                {day.label}
              </button>
            ))}
          </div>

          {/* Time slots */}
          <p className="text-[11px] font-semibold text-ink-muted uppercase tracking-wide mb-2">
            Available slots
          </p>
          <div className="grid grid-cols-2 gap-2 mb-5">
            {TIME_SLOTS.map(t => {
              const isBooked   = BOOKED.has(t)
              const isSelected = selTime === t
              return (
                <button
                  key={t}
                  disabled={isBooked}
                  onClick={() => !isBooked && setSelTime(t)}
                  className={`
                    py-2.5 rounded-lg text-[13px] font-medium font-sans
                    border-[1.5px] transition-all duration-150
                    ${isBooked
                      ? 'bg-bg text-ink-muted cursor-not-allowed border-line-light opacity-50'
                      : isSelected
                        ? 'bg-primary text-white border-primary'
                        : 'bg-transparent text-ink-mid border-line hover:border-accent hover:text-primary hover:bg-accent-dim cursor-pointer'
                    }
                  `}
                >
                  {t}
                </button>
              )
            })}
          </div>

          {/* Fee row */}
          <div className="flex justify-between items-center py-3 border-t border-line-light mb-4">
            <span className="text-sm text-ink-muted">Consultation fee</span>
            <span className="font-bold text-[18px] text-primary font-data">
              ₹{doctor.fee.toLocaleString()}
            </span>
          </div>

          <Button
            fullWidth
            size="lg"
            onClick={() => {
              if (!selDate || !selTime) {
                addToast('Please select a date and time slot.', 'error')
                return
              }
              setModalOpen(true)
            }}
          >
            Confirm Booking
          </Button>

          <p className="text-[11px] text-ink-muted text-center mt-3">
            Free cancellation up to 2 hours before appointment
          </p>
        </div>
      </div>

      {/* Booking confirmation modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Confirm Appointment">
        <p className="text-ink-mid text-sm mb-6 leading-relaxed">
          You&apos;re booking a consultation with <strong>{doctor.name}</strong> on{' '}
          <strong>{selDate}</strong> at <strong>{selTime}</strong>.
          An SMS confirmation will be sent to your registered number.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setModalOpen(false)}
            className="flex-1 py-2.5 rounded-lg border-[1.5px] border-line text-ink-mid text-sm font-medium font-sans cursor-pointer bg-transparent hover:border-primary hover:text-primary transition-all"
          >
            Cancel
          </button>
          <Button fullWidth onClick={handleConfirm}>
            Confirm Booking
          </Button>
        </div>
      </Modal>
    </div>
  )
}
