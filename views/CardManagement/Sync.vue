<template>
  <a-modal
    open
    width="800px"
    :maskClosable="false"
    :title="$t('CardManagement.Sync.427942-0')"
    :closable="false"
  >
    <div style="margin: 10px 0px 20px 0px; padding-right: 10px">
      <p>{{ $t('CardManagement.Sync.427942-1', [syncData.total]) }}</p>
    </div>
    <template #footer>
      <a-button :loading="loading" type="primary" @click="handleOk">{{ $t('CardManagement.Sync.427942-2') }}</a-button>
    </template>
  </a-modal>
</template>

<script setup name="SyncModal">
import {queryCount, sync} from '../../api/cardManagement'
import { useI18n } from 'vue-i18n';
import {onlyMessage} from "@jetlinks-web/utils";

const { t: $t } = useI18n();
const emit = defineEmits(['close'])

const props = defineProps({
  params: {
    type: Object,
    default: () => ({})
  }
})

const loading = ref(false)
const syncData = reactive({
  // count: 0,
  total: 0,
  // error: 0
})

const handleOk = async () => {
  loading.value = true
  const resp = await sync({terms: props.params?.terms}).finally(() => {
    loading.value = false
  })
  if(resp.success){
    onlyMessage($t('CardManagement.index.427944-57'))
    emit('close')
  }
}

const getTotal = () => {
  queryCount({
    "terms": [
      ...(props.params?.terms || []),
      {
        "column": "syncCardStatus",
        "termType": "not",
        "value": "running",
        type: 'and'
      }
    ]
  }).then(res => {
    if (res.success) {
      syncData.total = res.result
    }
  })
}

onMounted(() => {
  getTotal()
})
</script>

<style scoped></style>
