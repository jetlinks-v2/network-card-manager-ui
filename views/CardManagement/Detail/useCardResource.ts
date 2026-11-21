import { onScopeDispose, ref, shallowRef } from 'vue'

/** Each mounted card owns its resources. Only its most recent, still-mounted request may publish. */
export function useCardResource<T>() {
  const data = shallowRef<T>()
  const loading = ref(false)
  const failed = ref(false)
  let version = 0
  onScopeDispose(() => {
    version++
  })
  async function load(request: () => Promise<T>) {
    const current = ++version
    loading.value = true
    failed.value = false
    try {
      const result = await request()
      if (current === version) data.value = result
    } catch {
      if (current === version) failed.value = true
    } finally {
      if (current === version) loading.value = false
    }
  }
  return { data, loading, failed, load }
}

export function resultOf<T>(response: { success?: boolean; result?: T }) {
  if (!response.success) throw new Error('Card request failed')
  return response.result
}
