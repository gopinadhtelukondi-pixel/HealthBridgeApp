import { formatINR } from '@/utils'
import { RecommendedDoctorCard } from './RecommendedDoctorCard'
import { RecommendedHospitalCard } from './RecommendedHospitalCard'

export function RecommendationResults({ results }) {
  if (!results) {
    return (
      <div className="card p-8 text-center text-ink-muted">
        Enter your care needs to generate recommendations.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {results.urgencyNotice && (
        <div className="card p-5 border-danger bg-danger/5 text-danger text-sm font-semibold">
          {results.urgencyNotice}
        </div>
      )}

      <div className="card p-5">
        <h2 className="font-serif text-xl text-primary font-normal mb-2">Recommendation Summary</h2>
        <p className="text-sm text-ink-mid mb-2">{results.explanation}</p>
        <p className="text-xs text-ink-muted">{results.disclaimer}</p>
        {results.inferredSpecialty && (
          <p className="text-sm text-ink-mid mt-3">
            Specialty focus: <strong>{results.inferredSpecialty}</strong>
          </p>
        )}
        {results.costEstimate && (
          <p className="text-sm text-ink-mid mt-2">
            Typical estimated treatment total: <strong>{formatINR(results.costEstimate.estimate.total)}</strong>
          </p>
        )}
      </div>

      <section>
        <h2 className="font-bold text-primary mb-3">Recommended Doctors</h2>
        {results.doctors?.length ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {results.doctors.map(doctor => (
              <RecommendedDoctorCard key={doctor._id || doctor.id} doctor={doctor} />
            ))}
          </div>
        ) : (
          <div className="card p-6 text-center text-ink-muted">No matching doctors found. Try a broader city or specialty.</div>
        )}
      </section>

      <section>
        <h2 className="font-bold text-primary mb-3">Recommended Hospitals</h2>
        {results.hospitals?.length ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {results.hospitals.map(hospital => (
              <RecommendedHospitalCard key={hospital._id || hospital.id} hospital={hospital} />
            ))}
          </div>
        ) : (
          <div className="card p-6 text-center text-ink-muted">No matching hospitals found.</div>
        )}
      </section>
    </div>
  )
}
