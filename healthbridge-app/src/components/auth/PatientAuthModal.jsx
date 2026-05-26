import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useApp } from '@/context/AppContext'
import { loginUser, registerPatient } from '@/services/api'

const initialForm = {
  email: '',
  password: '',
  phone: '',
  name: '',
  city: '',
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneRegex = /^[0-9+\-\s()]{10,16}$/

export function PatientAuthModal({ open, onClose }) {
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
      if (!formData.city.trim()) return 'City is required'
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

      // FIX: signup/login now calls MongoDB-backed auth APIs instead of mock context users.
      const payload = isLogin
        ? await loginUser('patient', {
            email: formData.email.trim(),
            password: formData.password,
          })
        : await registerPatient({
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password,
            phone: formData.phone.trim(),
            city: formData.city.trim(),
          })

      setAuthenticatedUser(payload.user, payload.token)
      addToast(`Welcome, ${payload.user.name}`, 'success')
      onClose()
      setFormData(initialForm)
      setTimeout(() => navigate('/dashboard'), 300)
    } catch (error) {
      addToast(error.response?.data?.message || 'Authentication failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={isLogin ? 'Patient Login' : 'Patient Signup'}>
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {!isLogin && (
          <>
            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Vijayawada"
                className="input-field"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-semibold text-ink mb-1.5">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink mb-1.5">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Minimum 6 characters"
            className="input-field"
          />
        </div>

        <Button type="submit" size="md" className="w-full" disabled={loading}>
          {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
        </Button>

        <p className="text-center text-sm text-ink-muted">
          {isLogin ? 'Need an account? ' : 'Already have an account? '}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-accent font-semibold hover:text-primary cursor-pointer bg-transparent border-none"
          >
            {isLogin ? 'Sign up' : 'Login'}
          </button>
        </p>
      </form>
    </Modal>
  )
}
