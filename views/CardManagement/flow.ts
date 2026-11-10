export interface CardFlow {
  comboType?: { value: string }
  totalFlow?: number | null
  poolTotalFlow?: number | null
  usedFlow?: number | null
  residualFlow?: number | null
  poolResidualFlow?: number | null
}

function finiteFlow(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : undefined
}

/** Show the remaining balance ratio; pool balances belong to the pool and missing values stay unknown. */
export function cardFlowSummary(card: CardFlow) {
  const pool = card.comboType?.value === 'pool'
  const total = finiteFlow(pool ? card.poolTotalFlow : card.totalFlow)
  const residual = finiteFlow(pool ? card.poolResidualFlow : card.residualFlow)
  const used = finiteFlow(card.usedFlow)
  const remainingPercent = total !== undefined && total > 0 && residual !== undefined
    ? Math.min(100, residual / total * 100) : undefined
  return { total, residual, used, remainingPercent }
}

/** The prototype's 20% low-balance color is visual only; it does not configure business alarms. */
export function flowProgressColor(remainingPercent: number | undefined): string | undefined {
  return remainingPercent === undefined ? undefined : remainingPercent <= 20 ? 'var(--danger)' : 'var(--success)'
}

export function formatCardFlow(value: number | undefined): string {
  if (value === undefined) return '—'
  const divisor = value >= 1024 ? 1024 : 1
  return `${(value / divisor).toLocaleString(undefined, { maximumFractionDigits: 2 })} ${divisor === 1 ? 'MB' : 'GB'}`
}
