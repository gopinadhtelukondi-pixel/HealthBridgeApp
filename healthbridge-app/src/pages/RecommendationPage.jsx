import { useState } from 'react'
import { RecommendationForm } from '@/components/features/recommendations/RecommendationForm'
import { RecommendationResults } from '@/components/features/recommendations/RecommendationResults'
import { getRecommendations } from '@/services/api'
import { useApp } from '@/context/AppContext'

const initialForm = {
  symptoms: '',
  specialty: '',
  city: 'Vijayawada',
  budget: '',
  urgency: 'normal',
  preference: 'bestTrust',
  treatment: '',
}

export default function RecommendationPage() {
  const { addToast } = useApp()
  const [formData, setFormData] = useState(initialForm)
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.symptoms.trim() && !formData.specialty) {
      addToast('Enter symptoms or choose a specialty', 'error')
      return
    }

    if (Number(formData.budget || 0) < 0) {
      addToast('Budget cannot be negative', 'error')
      return
    }

    try {
      setLoading(true)
      const data = await getRecommendations({
        ...formData,
        budget: Number(formData.budget || 0),
      })
      setResults(data)
    } catch (error) {
      addToast(error.response?.data?.message || 'Could not generate recommendations', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-10 page-enter">
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
        <RecommendationForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
        />
        <RecommendationResults results={results} />
      </div>
    </div>
  )
}
