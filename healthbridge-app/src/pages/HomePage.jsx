/*
 * src/pages/HomePage.jsx
 * Fully API-integrated version (no static data)
 */

import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { DoctorCard } from '@/components/features/doctors/DoctorCard'
import { HospitalCard } from '@/components/features/hospitals/HospitalCard'

import { getDoctors, getHospitals } from '@/services/api'

/* Quick specialty chips */
const QUICK_CHIPS = [
  { emoji: '❤️', label: 'Cardiologist' },
  { emoji: '🧠', label: 'Neurologist' },
  { emoji: '🦴', label: 'Orthopedic' },
  { emoji: '👶', label: 'Pediatrician' },
  { emoji: '🔬', label: 'Dermatologist' },
]

export default function HomePage() {
  const navigate = useNavigate()

  const [doctors, setDoctors] = useState([])
  const [hospitals, setHospitals] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const d = await getDoctors()
      const h = await getHospitals()

      setDoctors(d)
      setHospitals(h)
    } catch (err) {
      console.error("Error loading homepage data:", err)
    }
  }

  const handleChipClick = (spec) => {
    navigate(`/search?spec=${encodeURIComponent(spec)}`)
  }

  const handleSearch = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      navigate(`/search?q=${encodeURIComponent(e.target.value.trim())}`)
    }
  }

  return (
    <div className="page-enter">

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-8 py-20">
        <h1 className="text-4xl font-bold mb-4">
          Find the right doctor with confidence
        </h1>

        <input
          placeholder="Search doctors..."
          onKeyDown={handleSearch}
          className="border p-3 w-full rounded-lg"
        />

        {/* Quick Chips */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {QUICK_CHIPS.map(c => (
            <button
              key={c.label}
              onClick={() => handleChipClick(c.label)}
              className="px-3 py-1 border rounded-full text-sm"
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
      </section>

      {/* DOCTORS */}
      <section className="max-w-6xl mx-auto px-8 pb-10">
        <h2 className="text-2xl font-semibold mb-4">Top Doctors</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {doctors.slice(0, 3).map(d => (
            <DoctorCard key={d.id} doctor={d} />
          ))}
        </div>
      </section>

      {/* HOSPITALS */}
      <section className="max-w-6xl mx-auto px-8 pb-10">
        <h2 className="text-2xl font-semibold mb-4">Top Hospitals</h2>

        <div className="flex flex-col gap-4">
          {hospitals.slice(0, 3).map(h => (
            <HospitalCard key={h.id} hospital={h} />
          ))}
        </div>
      </section>

    </div>
  )
}
