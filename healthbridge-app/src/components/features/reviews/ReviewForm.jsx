import { useState } from 'react'
import { Button } from '@/components/ui/Button'

const initialForm = {
  communication: 5,
  cost: 5,
  recovery: 5,
  waitingTime: 3,
  staffBehavior: 5,
  wouldRecommend: true,
  reviewText: '',
  anonymous: false,
}

function RatingSelect({ label, name, value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-ink-mid uppercase tracking-wide mb-1.5">{label}</label>
      <select name={name} value={value} onChange={onChange} className="input-field">
        {[5, 4, 3, 2, 1].map(score => (
          <option key={score} value={score}>{score} / 5</option>
        ))}
      </select>
    </div>
  )
}

export function ReviewForm({ doctor, currentUser, onSubmit, submitting }) {
  const [formData, setFormData] = useState(initialForm)
  const [billFile, setBillFile] = useState(null)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleBillChange = (e) => {
    setBillFile(e.target.files?.[0] || null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const reviewPayload = {
      doctorId: doctor._id || doctor.id,
      patientId: currentUser.id,
      anonymous: formData.anonymous,
      ratings: {
        communication: Number(formData.communication),
        cost: Number(formData.cost),
        recovery: Number(formData.recovery),
        waitingTime: Number(formData.waitingTime),
        staffBehavior: Number(formData.staffBehavior),
      },
      recommend: formData.wouldRecommend,
      text: formData.reviewText,
      billFile,
    }

    const success = await onSubmit(reviewPayload)

    if (success) {
      setFormData(initialForm)
      setBillFile(null)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-5">
      <div>
        <h3 className="font-serif text-xl text-primary font-normal">Write a Patient Review</h3>
        <p className="text-xs text-ink-muted mt-1">
          Reviews are patient-reported experiences and are moderated for safety, privacy, and fairness.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <RatingSelect label="Communication" name="communication" value={formData.communication} onChange={handleChange} />
        <RatingSelect label="Cost" name="cost" value={formData.cost} onChange={handleChange} />
        <RatingSelect label="Recovery" name="recovery" value={formData.recovery} onChange={handleChange} />
        <RatingSelect label="Wait" name="waitingTime" value={formData.waitingTime} onChange={handleChange} />
        <RatingSelect label="Staff" name="staffBehavior" value={formData.staffBehavior} onChange={handleChange} />
      </div>

      <div>
        <label className="block text-xs font-semibold text-ink-mid uppercase tracking-wide mb-1.5">Review</label>
        <textarea name="reviewText" value={formData.reviewText} onChange={handleChange} placeholder="Share what future patients should know. Minimum 20 characters." className="input-field min-h-[110px]" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <label className="flex items-center gap-2 text-sm text-ink-mid">
          <input type="checkbox" name="wouldRecommend" checked={formData.wouldRecommend} onChange={handleChange} />
          Would recommend
        </label>
        <label className="flex items-center gap-2 text-sm text-ink-mid">
          <input type="checkbox" name="anonymous" checked={formData.anonymous} onChange={handleChange} />
          Post anonymously
        </label>
      </div>

      <div>
        <label className="block text-xs font-semibold text-ink-mid uppercase tracking-wide mb-1.5">
          Optional bill or proof upload
        </label>
        <input type="file" accept="image/*,.pdf" onChange={handleBillChange} className="input-field" />
        {billFile && <p className="text-xs text-green-600 mt-1">Selected file: {billFile.name}</p>}
      </div>

      <Button type="submit" size="md" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  )
}
