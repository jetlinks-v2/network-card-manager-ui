<template>
  <a-modal
    visible
    width="800px"
    :maskClosable="false"
    title="同步"
    :closable="false"
  >
    <div style="margin: 10px 0px 20px 0px; padding-right: 10px">
      <div v-if="flag">
        <div>正在同步物联卡状态</div>
        <a-progress :percent="_percent" />
      </div>
      <div v-else>
        <p>{{ syncData.count }}张物联卡已同步至最新状态</p>
      </div>
    </div>
    <template #footer>
      <a-button v-if="!flag" type="primary" @click="handleCancel"
        >完成</a-button
      >
    </template>
  </a-modal>
</template>

<script setup name="SyncModal">
import { paramsEncodeQuery } from '@/utils/encodeQuery'
import { getToken, LocalStore, setToken } from '@jetlinks-web/utils'
import { EventSourcePolyfill } from 'event-source-polyfill'
import { queryCount } from '../../api/cardManagement'
import { BASE_API, TOKEN_KEY_URL } from '@jetlinks-web/constants'

const emit = defineEmits(['close'])

const props = defineProps({
  params: {
    type: Object,
    default: () => ({})
  }
})

const flag = ref(true)
const syncData = reactive({
  count: 0,
  total: 0,
  error: 0
})

const _percent = computed(() => {
  return syncData.total
    ? (((syncData.error + syncData.count) / syncData.total) * 100).toFixed(2)
    : 0
})

const handleCancel = () => {
  emit('close')
}

const getData = () => {
  const _params = paramsEncodeQuery(props.params)
  const urlParams = new URLSearchParams()

  Object.keys(_params).forEach((key) => {
    if (_params[key]) {
      urlParams.append(key, _params[key])
    }
  })
  const api = `${BASE_API}/network/card/state/_sync?${TOKEN_KEY_URL}=${getToken()}&${urlParams}`
  const esp = new EventSourcePolyfill(api)

  esp.onmessage = (e) => {
    syncData.count += Number(e.data)
    if (syncData.count >= syncData.total) {
      esp.close()
      flag.value = false
    }
  }

  esp.onerror = (e) => {
    esp.close()
    flag.value = false
  }
}

const getTotal = () => {
  queryCount(props.params).then((res) => {
    if (res.success) {
      syncData.total = res.result
      getData()
    }
  })
}

getTotal()
</script>

<style scoped></style>
