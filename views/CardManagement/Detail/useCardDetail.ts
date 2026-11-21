import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMenuStore } from '@jetlinks-web-core/store'
import { queryDetailById, queryDeactivate } from '../../../api/cardManagement'
import type { CardDetail } from '../../../api/cardDetail.types'
import { resultOf, useCardResource } from './useCardResource'

export type CardTab = 'overview' | 'statistics' | 'location'
export function useCardDetail(id: string) {
  const route = useRoute()
  const menu = useMenuStore()
  const card = useCardResource<CardDetail | undefined>()
  const reason = useCardResource<string | undefined>()
  const tab = ref<CardTab>('overview')
  const visited = ref(new Set<CardTab>())
  const editing = ref(false)
  const records = ref(false)
  const refresh = () =>
    card.load(async () => {
      const result = resultOf(await queryDetailById(id))
      return result?.id ? result : undefined
    })
  const stopped = computed(
    () => card.data.value?.cardStateType?.value === 'deactivate' && card.data.value.operatorName === 'onelink'
  )
  watch(card.data, () => {
    void reason.load(async () => (stopped.value ? resultOf(await queryDeactivate(id))?.message : undefined))
  })
  void refresh()
  function select(key: string | number) {
    if (key !== 'overview' && key !== 'statistics' && key !== 'location') return
    tab.value = key
    visited.value.add(key)
  }
  function afterEdit(saved?: boolean) {
    editing.value = false
    if (saved) void refresh()
  }
  function openRelation(kind: 'device' | 'pool') {
    const device = kind === 'device'
    const target = device ? card.data.value?.deviceId : card.data.value?.poolId
    if (target)
      menu.jumpPage(device ? 'device/Instance/Detail' : 'iot-card/TrafficPoolManagement/Detail', {
        params: { id: target }
      })
  }
  const back = () => menu.jumpPage('iot-card/CardManagement', { query: route.query })
  return {
    card,
    reason: reason.data,
    stopped,
    tab,
    visited,
    select,
    editing,
    records,
    afterEdit,
    refresh,
    openRelation,
    back
  }
}
