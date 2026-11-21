import dayjs from 'dayjs'
import type { DashboardQuery, FlowBucket } from '../../../api/cardDetail.types'
import type { Translate } from '../../components/list/types'
import { cardFlowSummary, type CardFlow } from '../flow'

export function detailFlow(card: CardFlow) {
  const { total, used, residual } = cardFlowSummary(card)
  const pool = card.comboType?.value === 'pool'
  const usedPercent = !pool && total !== undefined && total > 0 && used !== undefined ? (used / total) * 100 : undefined
  return { total, used, residual, pool, usedPercent }
}

export interface FlowRange {
  start: number
  end: number
  type?: string
}
export const groups = ['lastDay', 'month', 'year'] as const
const descriptor = { dashboard: 'flow', object: 'networkCardFlow', measurement: 'trend', dimension: 'agg' }
export function totalsQuery(cardId: string, t: Translate, now = dayjs()): DashboardQuery[] {
  const yesterday = now.subtract(1, 'day')
  return groups.map((group, index) => {
    const date = group === 'lastDay' ? yesterday : now
    const unit = group === 'lastDay' ? 'day' : group
    return {
      ...descriptor,
      group,
      params: {
        cardId,
        format: t(`Dashboard.index.537937-${10 + index}`),
        time: ['1h', '1d', '1M'][index],
        limit: [24, 31, 12][index],
        from: date.startOf(unit).valueOf(),
        to: date.endOf(unit).valueOf()
      }
    }
  })
}
export function trendQuery(cardId: string, range: FlowRange): DashboardQuery {
  const day = 86_400_000
  const span =
    range.type === 'day'
      ? range.end - range.start
      : dayjs(range.end).startOf('day').diff(dayjs(range.start).startOf('day'))
  const [time, format, limit] =
    span <= day
      ? ['1h', 'M月dd日 HH:mm', 24]
      : span < 365 * day
        ? ['1d', 'M月dd日', Math.ceil(span / day) + 1]
        : ['1M', 'yyyy年-M月', Math.floor(span / (30 * day))]
  return { ...descriptor, params: { cardId, time, format, limit, from: range.start, to: range.end } }
}
function numberValue(value: unknown) {
  if (typeof value !== 'number' && (typeof value !== 'string' || !value.trim())) return undefined
  const n = Number(value)
  return Number.isFinite(n) ? n : undefined
}
export function flowTotals(rows: FlowBucket[]) {
  return groups.map((group) => {
    const values = rows.filter((row) => row.group === group).map((row) => numberValue(row.data?.value))
    return values.length && values.every((v): v is number => v !== undefined)
      ? values.reduce((a, b) => a + b, 0)
      : undefined
  })
}
export function flowPoints(rows: FlowBucket[]) {
  return rows
    .flatMap(({ data }) =>
      data?.timeString ? [{ time: data.timeString, value: numberValue(data.value) ?? null }] : []
    )
    .reverse()
}
