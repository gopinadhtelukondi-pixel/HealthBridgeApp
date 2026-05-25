/*
 * src/pages/CostPage.jsx
 * Thin wrapper — delegates all UI to the CostEstimator feature component.
 */
import { CostEstimator } from '@/components/features/cost/CostEstimator'

export default function CostPage() {
  return <CostEstimator />
}
