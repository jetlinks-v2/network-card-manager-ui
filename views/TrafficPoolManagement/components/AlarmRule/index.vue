<template>
  <a-modal :confirm-loading="loading" visible :title="$t('TrafficPoolManagement.Detail.index.390590-2')" :width="800" @cancel="emits('close')" @ok="onSave">
    <div class="alarm-rule-box">
      <div class="tabs">
        <div v-for="item in tabList" :key="item.key" class="tabs-item">
          <a-switch v-model:checked="item.enabled"/>
          {{ item.label }}
        </div>
      </div>
      <div class="right">
        <component :data="data" ref="componentsRef" :is="components[activeKey]" :disabled="!_dt.enabled"/>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import TrafficAlarm from './TrafficAlarm.vue';
import {useI18n} from "vue-i18n";
import {onlyMessage} from "@jetlinks-web/utils";
import {update} from "@networkCardManager/api/trafficPoolManagement";

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})
const {t: $t} = useI18n();

const emits = defineEmits(['close', 'save'])
const activeKey = ref('TrafficAlarm')
const loading = ref(false)
const tabList = ref([
  {
    key: 'TrafficAlarm',
    label: $t('TrafficPoolManagement.Detail.index.390590-13'),
    enabled: true
  }
])
const componentsRef = ref()

const _dt = computed(() => {
  return tabList.value.find(item => item.key === activeKey.value)
})

const components = {
  'TrafficAlarm': TrafficAlarm
}

watch(() => props.data, (val) => {
  tabList.value[0].enabled = !!val.alarmConfig?.enabled
}, {
  immediate: true,
  deep: true
})

const onSave = async () => {
  if(!_dt.disabled) {
    const resp = await componentsRef.value.onSave()
    if(resp){
      loading.value = true;
      const res = await update(props.data.id, {
        alarmConfig: resp
      }).finally(() => {
        loading.value = false;
      })
      if (res.success) {
        onlyMessage($t('CardManagement.index.427944-57'))
        emits('save')
      }
    }
  } else {
    emits('close')
  }
}
</script>

<style lang="less" scoped>
.alarm-rule-box {
  display: flex;
  gap: 24px;
  height: 300px;

  .tabs {
    width: 200px;
    border-right: 1px solid #f0f0f0;
    padding-right: 24px;

    &-item {
      display: flex;
      gap: 16px;
      padding: 12px;
      background-color: @primary-1;
      cursor: pointer;
    }
  }

  .right {
    flex: 1;
    min-width: 0;
  }
}
</style>
