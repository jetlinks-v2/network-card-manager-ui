<template>
  <a-modal visible title="告警规则" :width="800" @cancel="emits('close')" @ok="onSave">
    <div class="alarm-rule-box">
      <div class="tabs">
        <div v-for="item in tabList" :key="item.key" class="tabs-item">
          <a-switch v-model:checked="item.disabled"/>
          {{ item.label }}
        </div>
      </div>
      <div class="right">
        <component ref="componentsRef" :is="components[activeKey]" :disabled="!_dt.disabled"/>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import TrafficAlarm from './TrafficAlarm.vue';

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})
const emits = defineEmits(['close', 'save'])
const activeKey = ref('TrafficAlarm')
const tabList = ref([
  {
    key: 'TrafficAlarm',
    label: '流量告警',
    disabled: true
  }
])
const componentsRef = ref()

const _dt = computed(() => {
  return tabList.value.find(item => item.key === activeKey.value)
})

const components = {
  'TrafficAlarm': TrafficAlarm
}


const onSave = async () => {
  if(!_dt.disabled) {
    const resp = await componentsRef.value.onSave()
    console.log(resp, 'resp')
    emits('save')
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
