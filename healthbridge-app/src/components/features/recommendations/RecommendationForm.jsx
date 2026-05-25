import { Button } from '@/components/ui/Button'

const SPECIALTIES = ['', 'Cardiologist', 'Neurologist', 'Orthopedic', 'Nephrologist', 'Oncologist', 'Gynecologist', 'Dermatologist', 'Pediatrician']
const TREATMENTS = ['', 'angioplasty', 'bypass', 'knee', 'hip', 'appendix', 'cataract', 'dialysis', 'chemo', 'mri', 'delivery']

export function RecommendationForm({ formData, onChange, onSubmit, loading }) {
  return (
    <form onSubmit={onSubmit} className="card p-6 space-y-5">
      <div>
        <h1 className="font-serif text-3xl text-primary font-normal">AI Recommendations</h1>
        <p className="text-sm text-ink-muted mt-1">
          Match symptoms, budget, city, and ranking signals to find suitable care options.
        </p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-ink-mid uppercase tracking-wide mb-1.5">Symptoms / Problem</label>
        <textarea
          name="symptoms"
          value={formData.symptoms}
          onChange={onChange}
          placeholder="Describe symptoms, disease, or treatment need..."
          className="input-field min-h-[100px]"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-ink-mid uppercase tracking-wide mb-1.5">Specialty</label>
          <select name="specialty" value={formData.specialty} onChange={onChange} className="input-field">
            {SPECIALTIES.map(spec => (
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
          <label className="block text-xs font-semibold text-ink-mid uppercase tracking-wide mb-1.5">Preference</label>
          <select name="preference" value={formData.preference} onChange={onChange} className="input-field">
            <option value="bestTrust">Best trust</option>
            <option value="affordable">Affordable</option>
            <option value="recovery">Recovery</option>
            <option value="communication">Communication</option>
            <option value="lowWait">Low waiting time</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink-mid uppercase tracking-wide mb-1.5">Treatment Cost</label>
          <select name="treatment" value={formData.treatment} onChange={onChange} className="input-field">
            {TREATMENTS.map(treatment => (
              <option key={treatment} value={treatment}>{treatment || 'Optional'}</option>
            ))}
          </select>
        </div>
      </div>

      <Button type="submit" size="lg" disabled={loading}>
        {loading ? 'Finding matches...' : 'Get Recommendations'}
      </Button>
    </form>
  )
}
