/*
 * src/components/features/cost/CostEstimator.jsx
 * ─────────────────────────────────────────────────────────────
 * AI-powered treatment cost estimation form.
 *
 * User selects:
 *   1. Treatment / procedure
 *   2. Hospital type (govt / private tier-2 / tier-1 / corporate)
 *   3. City tier (metro / tier-1 city / tier-2 / rural)
 *   4. Insurance status
 *
 * The useCostEstimate hook recalculates the estimate on every
 * change and returns P10 / P50 / P90 cost bands plus an
 * itemised breakdown.
 * ─────────────────────────────────────────────────────────────
 */
import { useCostEstimate } from '@/hooks'
import { formatINR } from '@/utils'

/* Reusable select row */
function SelectField({ label, value, onChange, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-ink-mid uppercase tracking-wide">
        {label}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="input-field"
      >
        {children}
      </select>
    </div>
  )
}

/* Cost band card — P10 / P50 / P90 */
function CostBand({ label, amount, desc, color }) {
  const colors = {
    green:  { bg: 'bg-success-bg border-success/30', label: 'text-success', amount: 'text-success' },
    blue:   { bg: 'bg-info-bg border-info/30',       label: 'text-info',    amount: 'text-info'    },
    orange: { bg: 'bg-warn-bg border-warn/30',       label: 'text-warn',    amount: 'text-warn'    },
  }
  const c = colors[color]

  return (
    <div className={`${c.bg} border rounded-card p-5 text-center`}>
      <p className={`text-[11px] font-semibold uppercase tracking-wider mb-1.5 ${c.label}`}>
        {label}
      </p>
      <p className={`font-serif text-[28px] ${c.amount}`}>{formatINR(amount)}</p>
      <p className="text-xs text-ink-muted mt-1">{desc}</p>
    </div>
  )
}

export function CostEstimator() {
  const {
    treatment,    setTreatment,
    hospitalType, setHospitalType,
    cityTier,     setCityTier,
    insurance,    setInsurance,
    estimate,
    treatmentData,
  } = useCostEstimate()

  return (
    <div className="max-w-3xl mx-auto px-8 py-12 page-enter">
      {/* Page heading */}
      <h1 className="font-serif text-4xl text-primary font-normal mb-2">Cost Estimator</h1>
      <p className="text-ink-mid text-[16px] mb-10">
        AI-powered treatment cost prediction based on 500K+ verified billing records.
      </p>

      {/* Form card */}
      <div className="card p-8 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <SelectField label="Treatment / Procedure" value={treatment} onChange={setTreatment}>
            <option value="">Select treatment…</option>
            <option value="angioplasty">Coronary Angioplasty</option>
            <option value="bypass">Bypass Surgery (CABG)</option>
            <option value="knee">Knee Replacement</option>
            <option value="hip">Hip Replacement</option>
            <option value="appendix">Appendectomy</option>
            <option value="cataract">Cataract Surgery</option>
            <option value="dialysis">Dialysis (per session)</option>
            <option value="chemo">Chemotherapy (per cycle)</option>
            <option value="mri">MRI Scan</option>
            <option value="delivery">Normal Delivery</option>
          </SelectField>

          <SelectField label="Hospital Type" value={hospitalType} onChange={setHospitalType}>
            <option value="govt">Government Hospital</option>
            <option value="tier2">Private Tier-2 Hospital</option>
            <option value="tier1">Private Tier-1 Hospital</option>
            <option value="corporate">Corporate / Super-specialty</option>
          </SelectField>

          <SelectField label="City Tier" value={cityTier} onChange={setCityTier}>
            <option value="metro">Metro (Delhi, Mumbai, Bangalore)</option>
            <option value="tier1city">Tier-1 City (Hyderabad, Vijayawada)</option>
            <option value="tier2city">Tier-2 City (Guntur, Kakinada)</option>
            <option value="rural">Rural / Small Town</option>
          </SelectField>

          <SelectField label="Insurance Status" value={insurance} onChange={setInsurance}>
            <option value="none">No Insurance (out-of-pocket)</option>
            <option value="basic">Basic Insurance</option>
            <option value="comprehensive">Comprehensive Insurance</option>
            <option value="ayushman">Ayushman Bharat</option>
          </SelectField>
        </div>
      </div>

      {/* Results — animate in when estimate is ready */}
      {estimate && treatmentData && (
        <div className="card p-8 animate-fade-in-up">
          <h2 className="font-serif text-xl text-primary font-normal mb-5">
            Cost estimate — {treatmentData.name}
          </h2>

          {/* P10 / P50 / P90 bands */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">
            <CostBand label="Budget (P10)"  amount={estimate.p10} desc="10% of patients paid less" color="green"  />
            <CostBand label="Typical (P50)" amount={estimate.p50} desc="Median cost nationwide"    color="blue"   />
            <CostBand label="Premium (P90)" amount={estimate.p90} desc="10% of patients paid more" color="orange" />
          </div>

          {/* Itemised breakdown */}
          <div className="bg-bg rounded-card p-5">
            {[
              { label: 'Procedure / Surgery',        value: estimate.procedure },
              { label: 'Hospital room (5 days avg)', value: estimate.room },
              { label: 'Medicines & consumables',    value: estimate.meds },
              { label: 'Diagnostics & tests',        value: estimate.tests },
            ].map(row => (
              <div
                key={row.label}
                className="flex justify-between items-center py-2 border-b border-line-light last:border-0"
              >
                <span className="text-sm text-ink-mid">{row.label}</span>
                <span className="font-data font-medium text-sm">{formatINR(row.value)}</span>
              </div>
            ))}

            {/* Total */}
            <div className="flex justify-between items-center pt-3 mt-1 border-t-2 border-line">
              <span className="font-bold text-ink">Total estimate</span>
              <span className="font-data font-bold text-[17px] text-primary">{formatINR(estimate.total)}</span>
            </div>
          </div>

          {/* Data source note */}
          <p className="text-xs text-ink-muted mt-4 flex items-center gap-1.5">
            <span>ℹ️</span>
            Based on <strong className="text-ink-mid">{treatmentData.records.toLocaleString()}</strong> verified
            billing records. Estimates are indicative — actual costs vary by patient and institution.
          </p>
        </div>
      )}

      {/* Empty state */}
      {!estimate && (
        <div className="text-center py-12 text-ink-muted">
          <p className="text-4xl mb-3">💊</p>
          <p className="text-[15px]">Select a treatment above to see the cost estimate</p>
        </div>
      )}
    </div>
  )
}
