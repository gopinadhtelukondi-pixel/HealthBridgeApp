import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { getMyReviews } from '@/services/api'
import { ReviewCard } from '@/components/features/reviews/ReviewCard'
import { Button } from '@/components/ui/Button'
import { Loader } from 'lucide-react'

const ACTION_CARDS = [
  {
    title: 'Find the right doctor',
    description: 'Search specialists, compare ratings, and book the best fit for your need.',
    button: 'Search doctors',
    link: '/search',
  },
  {
    title: 'Estimate treatment cost',
    description: 'See transparent cost ranges before you book your appointment.',
    button: 'Check cost',
    link: '/cost',
  },
  {
    title: 'Book an appointment',
    description: 'Pick a doctor, choose a slot, and confirm your consultation.',
    button: 'Start booking',
    link: '/search',
  },
]

export default function PatientDashboardPage() {
  const { currentUser } = useApp()
  const navigate = useNavigate()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  if (!currentUser) {
    return <Navigate to="/" replace />
  }

  if (currentUser.role !== 'patient') {
    if (currentUser.role === 'doctor') {
      const doctorId = currentUser.doctorId || currentUser.id || currentUser._id
      return <Navigate to={`/dashboard/${doctorId}`} replace />
    }
    if (currentUser.role === 'admin') {
      return <Navigate to="/admin" replace />
    }
    return <Navigate to="/" replace />
  }

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        setError(null)
        const id = currentUser.id || currentUser._id
        const data = await getMyReviews(id)
        setReviews(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error(err)
        setError('Unable to load your reviews. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [currentUser])

  const upcomingAppointments = currentUser.upcomingAppointments || []

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.24em] text-accent">Patient dashboard</p>
          <h1 className="mt-3 text-4xl font-semibold text-gray-900">Welcome back, {currentUser.name}</h1>
          <p className="mt-2 text-gray-600 max-w-2xl">
            Manage bookings, track your reviews, and continue your search from a single patient dashboard.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3 mb-12">
          {ACTION_CARDS.map((card) => (
            <div key={card.title} className="rounded-3xl border border-line-light bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">{card.title}</h2>
              <p className="text-gray-600 mb-6">{card.description}</p>
              <Button size="md" onClick={() => navigate(card.link)}>
                {card.button}
              </Button>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <section className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm border border-line-light">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-accent">Upcoming</p>
                  <h2 className="mt-2 text-2xl font-semibold text-gray-900">Your next appointments</h2>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate('/search')}>
                  Browse doctors
                </Button>
              </div>

              {upcomingAppointments.length > 0 ? (
                <div className="mt-6 space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div key={`${appointment.doctor}-${appointment.date}-${appointment.time}`} className="rounded-3xl border border-line-light bg-gray-50 p-5">
                      <p className="text-sm text-gray-500">{appointment.specialty} appointment</p>
                      <p className="text-lg font-semibold text-gray-900">{appointment.doctor}</p>
                      <p className="text-sm text-gray-600">{appointment.date} · {appointment.time}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-3xl border border-dashed border-line-light bg-gray-50 p-8 text-center text-gray-600">
                  <p className="text-lg font-medium text-gray-900">No upcoming appointments yet</p>
                  <p className="mt-2">Search doctors and book a consultation to see it here.</p>
                  <Button className="mt-6" onClick={() => navigate('/search')}>
                    Book now
                  </Button>
                </div>
              )}
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm border border-line-light">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-accent">Reviews</p>
                  <h2 className="mt-2 text-2xl font-semibold text-gray-900">Your submitted reviews</h2>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate('/doctor')}>Write a review</Button>
              </div>

              {loading ? (
                <div className="mt-10 flex items-center justify-center">
                  <Loader className="animate-spin text-primary" size={26} />
                </div>
              ) : error ? (
                <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
                  {error}
                </div>
              ) : reviews.length === 0 ? (
                <div className="mt-8 rounded-3xl border border-line-light bg-gray-50 p-8 text-center text-gray-600">
                  <p className="text-lg font-medium text-gray-900">No reviews yet</p>
                  <p className="mt-2">Once you submit a review it will appear here.</p>
                  <Button className="mt-6" onClick={() => navigate('/search')}>
                    Find a doctor to review
                  </Button>
                </div>
              ) : (
                <div className="mt-8 space-y-4">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id || review._id} review={review} />
                  ))}
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl bg-blue-950/5 p-6 border border-blue-100 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900">Why use the patient dashboard?</h3>
              <ul className="mt-4 space-y-3 text-gray-600 text-sm list-disc list-inside">
                <li>Keep all your reviews and appointments in one place.</li>
                <li>Return to search and booking quickly.</li>
                <li>Compare doctor cost and ratings before you book.</li>
              </ul>
            </div>

            <div className="rounded-3xl bg-white p-6 border border-line-light shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Next step</h3>
              <p className="mt-3 text-gray-600">Browse nearby specialists and book consultations with trusted providers.</p>
              <Button className="mt-6 w-full" onClick={() => navigate('/search')}>
                Search doctors
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
