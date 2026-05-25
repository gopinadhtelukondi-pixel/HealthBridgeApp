import { formatINR } from '@/utils'
import { RecommendedDoctorCard } from '@/components/features/recommendations/RecommendedDoctorCard'
import { RecommendedHospitalCard } from '@/components/features/recommendations/RecommendedHospitalCard'

export function AssistantResults({ results }) {
  if (!results) {
    return (
      <div className="card p-8 text-center text-ink-muted">
        Ask the virtual doctor and get care guidance, specialty inference, and recommended providers.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="card p-5">
        <h2 className="font-serif text-xl text-primary font-normal mb-2">Virtual Doctor Assistant</h2>
        <p className="text-sm text-ink-mid mb-3">{results.assistantMessage}</p>
        <p className="text-xs text-ink-muted">{results.disclaimer}</p>
      </div>

      {results.urgencyNotice && (
        <div className="card p-5 border-danger bg-danger/5 text-danger text-sm font-semibold">
          {results.urgencyNotice}
        </div>
      )}

      <section>
        <h2 className="font-bold text-primary mb-3">Recommended Doctors</h2>
        {results.doctors?.length ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {results.doctors.map((doctor) => (
              <RecommendedDoctorCard key={doctor._id || doctor.id} doctor={doctor} />
            ))}
          </div>
        ) : (
          <div className="card p-6 text-center text-ink-muted">
            No doctor recommendations available. Try updating the symptoms or city.
          </div>
        )}
      </section>

      <section>
        <h2 className="font-bold text-primary mb-3">Recommended Hospitals</h2>
        {results.hospitals?.length ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {results.hospitals.map((hospital) => (
              <RecommendedHospitalCard key={hospital._id || hospital.id} hospital={hospital} />
            ))}
          </div>
        ) : (
          <div className="card p-6 text-center text-ink-muted">No hospital recommendations available.</div>
        )}
      </section>

      {results.costEstimate && (
        <div className="card p-5">
          <h3 className="text-lg font-semibold text-primary mb-2">Estimated Cost</h3>
          <p className="text-sm text-ink-mid">
            Total estimated treatment cost: <strong>{formatINR(results.costEstimate.estimate.total)}</strong>
          </p>
        </div>
      )}
    </div>
  )
}
