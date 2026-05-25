import { Button } from '@/components/ui/Button'

const SPECIALTIES = ['', 'Cardiologist', 'Neurologist', 'Orthopedic', 'Nephrologist', 'Oncologist', 'Gynecologist', 'Dermatologist', 'Pediatrician']
const TREATMENTS = ['', 'angioplasty', 'bypass', 'knee', 'hip', 'appendix', 'cataract', 'dialysis', 'chemo', 'mri', 'delivery']

export function AssistantForm({ formData, onChange, onSubmit, loading }) {
  return (
    <form onSubmit={onSubmit} className="card p-6 space-y-5">
      <div>
        <h1 className="font-serif text-3xl text-primary font-normal">Virtual Doctor Assistant</h1>
        <p className="text-sm text-ink-muted mt-1">
          Describe your symptoms and get a virtual doctor-style recommendation and care guidance.
        </p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-ink-mid uppercase tracking-wide mb-1.5">Describe your symptoms</label>
        <textarea
          name="symptoms"
          value={formData.symptoms}
          onChange={onChange}
          placeholder="Describe symptoms, problems, or treatment concerns..."
          className="input-field min-h-[100px]"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-ink-mid uppercase tracking-wide mb-1.5">Specialty</label>
          <select name="specialty" value={formData.specialty} onChange={onChange} className="input-field">
            {SPECIALTIES.map((spec) => (
              <option key={spec} value={spec}>{spec || 'Infer from symptoms'}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink-mid uppercase tracking-wide mb-1.5">City</label>
          <input name="city" value={formData.city} onChange={onChange} placeholder="Vijayawada" className="input-field" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink-mid uppercase tracking-wide mb-1.5">Budget</label>
          <input type="number" min="0" name="budget" value={formData.budget} onChange={onChange} placeholder="50000" className="input-field" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-ink-mid uppercase tracking-wide mb-1.5">Urgency</label>
          <select name="urgency" value={formData.urgency} onChange={onChange} className="input-field">
            <option value="normal">Normal</option>
            <option value="soon">Need soon</option>
            <option value="emergency">Emergency</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink-mid uppercase tracking-wide mb-1.5">Treatment</label>
          <select name="treatment" value={formData.treatment} onChange={onChange} className="input-field">
            {TREATMENTS.map((treatment) => (
              <option key={treatment} value={treatment}>{treatment || 'Optional'}</option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <Button type="submit" size="lg" disabled={loading} fullWidth>
            {loading ? 'Consulting virtual doctor...' : 'Ask Virtual Doctor'}
          </Button>
        </div>
      </div>
    </form>
  )
}
