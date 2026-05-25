import { useState } from 'react'
import { AssistantForm } from '@/components/features/assistant/AssistantForm'
import { AssistantResults } from '@/components/features/assistant/AssistantResults'
import { getAssistantAdvice } from '@/services/api'
import { useApp } from '@/context/AppContext'

const initialForm = {
  symptoms: '',
  specialty: '',
  city: 'Vijayawada',
  budget: '',
  urgency: 'normal',
  treatment: '',
}

export default function AssistantPage() {
  const { addToast } = useApp()
  const [formData, setFormData] = useState(initialForm)
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
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
      const data = await getAssistantAdvice({
        ...formData,
        budget: Number(formData.budget || 0),
      })
      setResults(data)
    } catch (error) {
      addToast(error.response?.data?.message || 'Could not get virtual doctor advice', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-10 page-enter">
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
        <AssistantForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
        />
        <AssistantResults results={results} />
      </div>
    </div>
  )
}
