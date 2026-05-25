/*
 * src/utils/index.js
 * FINAL FIX (no dependency on deleted /data folder)
 */

/* ✅ Multipliers moved here (local constants) */
const HOSPITAL_MULTS = { govt: 0.3, tier2: 1.0, tier1: 1.5, corporate: 2.2 }
const CITY_MULTS     = { metro: 1.4, tier1city: 1.0, tier2city: 0.75, rural: 0.55 }
const INS_MULTS      = { none: 1.0, basic: 0.7, comprehensive: 0.5, ayushman: 0.2 }

/** formatINR */
export function formatINR(amount) {
  if (!amount) return 'N/A'
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`
  if (amount >= 1000)   return `₹${Math.round(amount / 1000)}K`
  return `₹${amount}`
}

/** getScoreStroke */
export function getScoreStroke(score) {
  if (score >= 85) return '#00c97d'
  if (score >= 70) return '#b8620a'
  return '#c0392b'
}

/** calculateCostEstimate */
export function calculateCostEstimate(data, hospitalType, cityTier, insurance) {
  const mult =
    (HOSPITAL_MULTS[hospitalType] ?? 1) *
    (CITY_MULTS[cityTier]         ?? 1) *
    (INS_MULTS[insurance]         ?? 1)

  const p10       = Math.round(data.base[0] * mult)
  const p50       = Math.round(data.base[1] * mult)
  const p90       = Math.round(data.base[2] * mult)
  const procedure = Math.round(data.base[1] * 0.6 * mult)
  const room      = Math.round(data.room  * mult)
  const meds      = Math.round(data.meds  * mult)
  const tests     = Math.round(data.tests * mult)
  const total     = procedure + room + meds + tests

  return { p10, p50, p90, procedure, room, meds, tests, total }
}