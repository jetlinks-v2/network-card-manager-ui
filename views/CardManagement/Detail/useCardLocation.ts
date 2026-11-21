import { queryLocationById } from '../../../api/cardManagement'
import { getPositionById } from '../../../api/realtimePositioning'
import type { CardPosition } from '../../../api/cardDetail.types'
import { resultOf, useCardResource } from './useCardResource'

export function useCardLocation(id: string, historySupported: boolean) {
  const position = useCardResource<CardPosition[]>()
  async function read(active: boolean) {
    const point = resultOf(await (active ? getPositionById(id) : queryLocationById(id)))
    if (point?.error) throw new Error('Position unavailable')
    if (point && Number.isFinite(point.longitude) && Number.isFinite(point.latitude)) return [point]
    if (active) throw new Error('No operator position')
    return []
  }
  const history = () => (historySupported ? position.load(() => read(false)) : undefined)
  // The live operator endpoint may incur a fee. Never invoke it from mount, retry, or a tab watcher.
  const locate = () => !position.loading.value && position.load(() => read(true))
  void history()
  return { position, history, locate }
}
