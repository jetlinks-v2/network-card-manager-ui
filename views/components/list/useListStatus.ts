import { computed, onScopeDispose, ref, shallowRef } from 'vue'
import type { SwitchGroupOption } from '@jetlinks-web-core/components/SwitchGroup'
import { withListStatus } from './query'
import type { ListQuery, Translate } from './types'

/** Two lists share query composition and count lifecycle, but retain their own APIs. */
export function useListStatus(config: {
  request: (query: ListQuery) => Promise<{ success?: boolean; result?: unknown }>
  column: string
  options: { value: string; label: string }[]
  count: (query: ListQuery) => Promise<number>
  t: Translate
}) {
  const searchParams = shallowRef<ListQuery>({})
  const status = ref('all')
  const counts = ref<Record<string, number | string>>({})
  const listError = ref(false)
  let epoch = 0
  const params = computed(() => withListStatus(searchParams.value, config.column, status.value))
  const statusOptions = computed<SwitchGroupOption[]>(() => [
    { value: 'all', label: 'SimList.all' }, ...config.options,
  ].map(option => ({ ...option, label: config.t(option.label), count: counts.value[option.value] ?? '—' })))

  async function refreshCounts() {
    const current = ++epoch
    const query = searchParams.value
    counts.value = {}
    const values = await Promise.allSettled(statusOptions.value.map(async option => [
      String(option.value), await config.count(withListStatus(query, config.column, String(option.value))),
    ] as const))
    // A previous search, reload or unmounted page must never replace current counts.
    if (current !== epoch) return
    counts.value = Object.fromEntries(values.flatMap(value => value.status === 'fulfilled' ? [value.value] : []))
  }

  async function requestList(query: ListQuery, context?: { signal?: AbortSignal }) {
    listError.value = false
    void refreshCounts()
    try {
      const response = await config.request(query)
      if (!context?.signal?.aborted) listError.value = !response.success
      return response
    } catch (error) {
      if (!context?.signal?.aborted) listError.value = true
      throw error
    }
  }

  function changeStatus(value: string | number) { status.value = String(value) }
  function handleSearch(query: ListQuery) { searchParams.value = query }
  onScopeDispose(() => { epoch++ })
  return { params, status, statusOptions, listError, requestList, refreshCounts, changeStatus, handleSearch }
}
