<template>
  <a-modal
      open
      title="添加设备"
      :width="1200"
      @cancel="emits('close')"
      @ok="handleOk"
      :confirm-loading="loading"
      :mask-closable="false"
  >
    <TabsCard :options="options" v-model:active-key="activeKey"/>
    <div class="config-content">
      <component :is="components[activeKey]" ref="componentRef" :defaultParams="defaultParams"/>
    </div>
  </a-modal>
</template>

<script setup>
import _Self from './_Self.vue'
import All from './All.vue'
import Org from './Org.vue'
import {useI18n} from "vue-i18n";

const props = defineProps({
  defaultParams: {
    type: Object,
    default: () => ({}),
  }
})
const emits = defineEmits(['close', 'save']);

const {t: $t} = useI18n();

const activeKey = ref('_Self')
const componentRef = ref()
const loading = ref(false)

const options = computed(() => {
  return [
    {
      label: $t('TrafficPoolManagement.Detail.index.390590-36'),
      value: '_Self',
      desc: $t('TrafficPoolManagement.Detail.index.390590-37')
    },
    {
      label: $t('TrafficPoolManagement.Detail.index.390590-38'),
      value: 'All',
      desc: $t('TrafficPoolManagement.Detail.index.390590-39')
    },
    {
      label: $t('TrafficPoolManagement.Detail.index.390590-40'),
      value: 'Org',
      desc: $t('TrafficPoolManagement.Detail.index.390590-41')
    },
  ]
})

const components = {
  _Self,
  All,
  Org,
}

const handleOk = async () => {
  const resp = await componentRef.value?.onSave?.()
  if (resp) {
    emits('save', resp)
  }
};
</script>

<style lang="less" scoped>
.config-content {
  margin-top: 16px;
  display: flex;
  height: 450px;
  flex-direction: column;
}
</style>
