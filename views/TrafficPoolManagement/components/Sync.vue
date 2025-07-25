<template>
  <a-modal visible :title="$t('CardManagement.Sync.427942-0')" :confirm-loading="loading" @ok="onOk" @cancel="emit('close')">
    <p>{{ $t('CardManagement.Sync.427942-1', [data.cardTotal || 0]) }}</p>
<!--    <template #footer>-->
<!--      <a-button type="primary" :loading="loading" @click="onOk">{{ $t('CardManagement.Sync.427942-2') }}</a-button>-->
<!--    </template>-->
  </a-modal>
</template>

<script setup>
import {useI18n} from "vue-i18n";
import {syncTrafficPool} from "@networkCardManager/api/trafficPoolManagement";
import {onlyMessage} from "@jetlinks-web/utils";

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})
const emit = defineEmits(['close'])
const {t: $t} = useI18n();
const loading = ref(false)
const onOk = async () => {
  loading.value = true
  const resp = await syncTrafficPool(props.data.id).finally(() => {
    loading.value = false
  })
  if(resp.success){
    emit('close')
    onlyMessage($t('CardManagement.index.427944-57'))
  }
}
</script>

<style lang="less" scoped>

</style>
