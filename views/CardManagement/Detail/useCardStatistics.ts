import { shallowRef } from 'vue'
import { dashboard } from '../../../api/cardManagement'
import type { FlowBucket } from '../../../api/cardDetail.types'
import type { Translate } from '../../components/list/types'
import { flowPoints, flowTotals, totalsQuery, trendQuery, type FlowRange } from './detailFlow'
import { resultOf, useCardResource } from './useCardResource'

export function useCardStatistics(id: string, t: Translate) {
  const totals = useCardResource<ReturnType<typeof flowTotals>>()
  const trend = useCardResource<ReturnType<typeof flowPoints>>()
  const range = shallowRef<FlowRange>()
  const loadTotals = () =>
    totals.load(async () => flowTotals(resultOf(await dashboard<FlowBucket[]>(totalsQuery(id, t))) ?? []))
  const loadTrend = (next = range.value) => {
    if (!next) return
    range.value = next
    return trend.load(async () => flowPoints(resultOf(await dashboard<FlowBucket[]>(trendQuery(id, next))) ?? []))
  }
  void loadTotals()
  return { totals, trend, loadTotals, loadTrend }
}
