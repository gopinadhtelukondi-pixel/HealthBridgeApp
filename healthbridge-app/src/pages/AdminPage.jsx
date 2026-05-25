import { useEffect, useState } from 'react'
import { useApp } from '@/context/AppContext'
import { getPendingReviews, getReviewSummary, moderateReview } from '@/services/api'
import { ReviewCard } from '@/components/features/reviews/ReviewCard'
import { Button } from '@/components/ui/Button'

export default function AdminPage() {
  const { currentUser, addToast } = useApp()
  const [reviews, setReviews] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') return
    fetchAdminData()
  }, [currentUser])

  const fetchAdminData = async () => {
    try {
      setLoading(true)
      const [summaryData, pendingReviews] = await Promise.all([
        getReviewSummary(),
        getPendingReviews(),
      ])
      setSummary(summaryData)
      setReviews(pendingReviews || [])
    } catch (error) {
      console.error(error)
      addToast('Unable to load admin dashboard data', 'error')
      setReviews([])
      setSummary(null)
    } finally {
      setLoading(false)
    }
  }

  const fetchPendingReviews = async () => {
    try {
      setLoading(true)
      const data = await getPendingReviews()
      setReviews(data || [])
    } catch (error) {
      console.error(error)
      addToast('Unable to load pending reviews', 'error')
      setReviews([])
    } finally {
      setLoading(false)
    }
  }

  const handleModeration = async (reviewId, status) => {
    try {
      setActionLoading(true)
      await moderateReview(reviewId, status)
      addToast(`Review ${status === 'approved' ? 'approved' : 'rejected'}.`, 'success')
      await fetchAdminData()
    } catch (error) {
      console.error(error)
      addToast('Could not update review status', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="text-center py-20 text-ink-muted">
        <p className="text-xl font-semibold mb-3">Access denied</p>
        <p>Only admin users can view the moderation board.</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.24em] text-accent">Admin moderation</p>
        <h1 className="text-3xl font-semibold text-ink mt-3">
          Moderation & analytics
        </h1>
        <p className="mt-2 text-ink-muted max-w-2xl">
          Review submissions flagged by the system appear here, along with a quick summary of review volume and quality metrics.
        </p>
      </div>

      {summary && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5 mb-8">
            <div className="rounded-3xl bg-white border border-line-light p-6 shadow-sm">
              <p className="text-sm text-ink-muted uppercase tracking-[0.24em] mb-2">Pending reviews</p>
              <p className="text-3xl font-semibold text-gray-900">{summary.pendingReviews}</p>
            </div>
            <div className="rounded-3xl bg-white border border-line-light p-6 shadow-sm">
              <p className="text-sm text-ink-muted uppercase tracking-[0.24em] mb-2">Approved</p>
              <p className="text-3xl font-semibold text-gray-900">{summary.approvedReviews}</p>
            </div>
            <div className="rounded-3xl bg-white border border-line-light p-6 shadow-sm">
              <p className="text-sm text-ink-muted uppercase tracking-[0.24em] mb-2">Rejected</p>
              <p className="text-3xl font-semibold text-gray-900">{summary.rejectedReviews}</p>
            </div>
            <div className="rounded-3xl bg-white border border-line-light p-6 shadow-sm">
              <p className="text-sm text-ink-muted uppercase tracking-[0.24em] mb-2">Flagged</p>
              <p className="text-3xl font-semibold text-gray-900">{summary.flaggedReviews}</p>
            </div>
            <div className="rounded-3xl bg-white border border-line-light p-6 shadow-sm">
              <p className="text-sm text-ink-muted uppercase tracking-[0.24em] mb-2">Avg review rating</p>
              <p className="text-3xl font-semibold text-gray-900">{summary.averageRating || '—'}</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 mb-10">
            <section className="rounded-3xl bg-white border border-line-light p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-ink-muted uppercase tracking-[0.24em]">Hospital transparency</p>
                  <h2 className="mt-3 text-xl font-semibold text-gray-900">City transparency score</h2>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {summary.transparencyByCity?.length > 0 ? (
                  summary.transparencyByCity.map((item) => (
                    <div key={item.city}>
                      <div className="flex items-center justify-between mb-2 text-sm text-ink-muted">
                        <span>{item.city}</span>
                        <span>{item.averageTransparency}</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${Math.min(100, item.averageTransparency * 20)}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-ink-muted">No hospital transparency data available yet.</p>
                )}
              </div>
              <div className="mt-8 border-t border-line-light pt-5">
                <p className="text-sm uppercase tracking-[0.24em] text-ink-muted">Top hospitals</p>
                <div className="mt-4 space-y-3">
                  {summary.topHospitals?.map((hospital) => (
                    <div key={hospital.name} className="rounded-2xl bg-gray-50 p-4">
                      <p className="font-semibold text-gray-900">{hospital.name}</p>
                      <p className="text-sm text-ink-muted">{hospital.city} · Transparency {hospital.transparencyScore}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-white border border-line-light p-6 shadow-sm">
              <p className="text-sm text-ink-muted uppercase tracking-[0.24em]">Cost trends</p>
              <h2 className="mt-3 text-xl font-semibold text-gray-900">Average fees over time</h2>
              <div className="mt-6 space-y-3">
                {summary.costTrend?.length > 0 ? (
                  summary.costTrend.map((point) => (
                    <div key={point.label}>
                      <div className="flex items-center justify-between text-sm text-ink-muted mb-1">
                        <span>{point.label}</span>
                        <span>₹{point.value}</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${Math.min(100, (point.value / Math.max(...summary.costTrend.map((p) => p.value))) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-ink-muted">No cost trend data available yet.</p>
                )}
              </div>
            </section>
          </div>

          <div className="grid gap-6 xl:grid-cols-4 mb-10">
            <section className="rounded-3xl bg-white border border-line-light p-6 shadow-sm xl:col-span-2">
              <p className="text-sm text-ink-muted uppercase tracking-[0.24em]">Department ratings</p>
              <h2 className="mt-3 text-xl font-semibold text-gray-900">Top specialties by rating</h2>
              <div className="mt-6 space-y-4">
                {summary.departmentRatings?.length > 0 ? (
                  summary.departmentRatings.map((item) => (
                    <div key={item.department}>
                      <div className="flex items-center justify-between mb-2 text-sm text-ink-muted">
                        <span>{item.department}</span>
                        <span>{item.averageRating}</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${Math.min(100, item.averageRating * 20)}%` }} />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-ink-muted">Department performance is not available yet.</p>
                )}
              </div>
            </section>

            <section className="rounded-3xl bg-white border border-line-light p-6 shadow-sm xl:col-span-2">
              <p className="text-sm text-ink-muted uppercase tracking-[0.24em]">City quality</p>
              <h2 className="mt-3 text-xl font-semibold text-gray-900">City-wise healthcare rating</h2>
              <div className="mt-6 space-y-4">
                {summary.cityQuality?.length > 0 ? (
                  summary.cityQuality.map((item) => (
                    <div key={item.city}>
                      <div className="flex items-center justify-between mb-2 text-sm text-ink-muted">
                        <span>{item.city}</span>
                        <span>{item.averageRating}</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                        <div className="h-full bg-accent" style={{ width: `${Math.min(100, item.averageRating * 20)}%` }} />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-ink-muted">City-level quality metrics are not available yet.</p>
                )}
              </div>
            </section>
          </div>

          <div className="rounded-3xl bg-white border border-line-light p-6 shadow-sm">
            <p className="text-sm text-ink-muted uppercase tracking-[0.24em]">Review distribution</p>
            <h2 className="mt-3 text-xl font-semibold text-gray-900">Approved review score breakdown</h2>
            <div className="mt-6 space-y-4">
              {summary.ratingDistribution?.map((item) => (
                <div key={item.rating}>
                  <div className="flex items-center justify-between mb-2 text-sm text-ink-muted">
                    <span>{item.rating} star</span>
                    <span>{item.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${Math.min(100, (item.count / Math.max(...summary.ratingDistribution.map((row) => row.count || 1))) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {loading ? (
        <div className="card p-8 text-center text-ink-muted">Loading pending reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="card p-8 text-center text-ink-muted">No reviews are waiting for moderation.</div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="space-y-4">
              <ReviewCard review={review} showStatus />
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  size="sm"
                  onClick={() => handleModeration(review.id, 'approved')}
                  disabled={actionLoading}
                >
                  Approve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleModeration(review.id, 'rejected')}
                  disabled={actionLoading}
                >
                  Reject
                </Button>
                {review.flags?.length > 0 && (
                  <div className="text-xs text-ink-muted bg-bg-card border border-line-light px-3 py-1 rounded-full">
                    Flags: {review.flags.join(', ')}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
