import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useApp } from '@/context/AppContext'
import { loginUser, registerDoctor } from '@/services/api'

const initialForm = {
  email: '',
  password: '',
  phone: '',
  license: '',
  name: '',
  hospital: '',
  city: '',
  spec: '',
  fee: '',
  exp: '',
  education: '',
  bio: '',
  tags: '',
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneRegex = /^[0-9+\-\s()]{10,16}$/

export function DoctorAuthModal({ open, onClose }) {
  const navigate = useNavigate()
  const { setAuthenticatedUser, addToast } = useApp()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState(initialForm)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    if (!emailRegex.test(formData.email)) return 'Enter a valid email address'
    if (formData.password.length < 6) return 'Password must be at least 6 characters'

    if (!isLogin) {
      if (!formData.name.trim()) return 'Full name is required'
      if (!phoneRegex.test(formData.phone)) return 'Enter a valid phone number'
      if (!formData.license.trim()) return 'Medical license number is required'
      if (!formData.hospital.trim()) return 'Hospital or clinic is required'
      if (!formData.city.trim()) return 'City is required'
      if (!formData.spec.trim()) return 'Specialty is required'
      if (Number(formData.fee) <= 0) return 'Consultation fee must be greater than 0'
      if (Number(formData.exp) < 0 || formData.exp === '') return 'Experience cannot be negative'
    }

    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationError = validate()
    if (validationError) {
      addToast(validationError, 'error')
      return
    }

    try {
      setLoading(true)

      // FIX: doctor signup creates both an auth user and a Doctor profile in MongoDB.
      const payload = isLogin
        ? await loginUser('doctor', {
            email: formData.email.trim(),
            password: formData.password,
          })
        : await registerDoctor({
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password,
            phone: formData.phone.trim(),
            license: formData.license.trim(),
            hospital: formData.hospital.trim(),
            city: formData.city.trim(),
            spec: formData.spec.trim(),
            fee: Number(formData.fee),
            exp: Number(formData.exp),
            education: formData.education.trim(),
            bio: formData.bio.trim(),
            tags: formData.tags.trim(),
          })

      setAuthenticatedUser(payload.user, payload.token)
      addToast(`Welcome, ${payload.user.name}`, 'success')
      onClose()
      setFormData(initialForm)
      const doctorId = payload.user.doctorId || payload.user.id || payload.user._id
      setTimeout(() => navigate(`/dashboard/${doctorId}`), 300)
    } catch (error) {
      addToast(error.response?.data?.message || 'Authentication failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isLogin ? 'Doctor Login' : 'Doctor Signup'}>
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {!isLogin && (
          <>
            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Dr. Name" className="input-field" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">Phone</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 9876543210" className="input-field" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Vijayawada" className="input-field" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5">Medical License Number</label>
              <input type="text" name="license" value={formData.license} onChange={handleChange} placeholder="NMC License Number" className="input-field" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5">Hospital / Clinic</label>
              <input type="text" name="hospital" value={formData.hospital} onChange={handleChange} placeholder="Your hospital name" className="input-field" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">Specialty</label>
                <input type="text" name="spec" value={formData.spec} onChange={handleChange} placeholder="Cardiologist" className="input-field" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">Fee</label>
                <input type="number" min="1" name="fee" value={formData.fee} onChange={handleChange} placeholder="800" className="input-field" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-ink mb-1.5">Experience</label>
                <input type="number" min="0" name="exp" value={formData.exp} onChange={handleChange} placeholder="10" className="input-field" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5">Education</label>
              <input type="text" name="education" value={formData.education} onChange={handleChange} placeholder="MBBS, MD" className="input-field" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5">Tags</label>
              <input type="text" name="tags" value={formData.tags} onChange={handleChange} placeholder="Heart Failure, Angioplasty" className="input-field" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5">Bio</label>
              <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Short professional profile" className="input-field min-h-[96px]" />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-semibold text-ink mb-1.5">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="doctor@example.com" className="input-field" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink mb-1.5">Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Minimum 6 characters" className="input-field" />
        </div>

        <Button type="submit" size="md" className="w-full" disabled={loading}>
          {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
        </Button>

        <p className="text-center text-sm text-ink-muted">
          {isLogin ? 'Need an account? ' : 'Already have an account? '}
          <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-accent font-semibold hover:text-primary cursor-pointer bg-transparent border-none">
            {isLogin ? 'Sign up' : 'Login'}
          </button>
        </p>
      </form>
    </Modal>
  )
}
