<template>
  <a-modal :confirm-loading="loading" open :title="$t('TrafficPoolManagement.Detail.index.390590-2')" :width="800" @cancel="emits('close')" @ok="onSave">
    <EqualHeightColumns
        class="alarm-rule-box"
        :height="300"
        :left-width="200"
        :gap="24"
        :collapsible="false"
    >
      <template #left>
        <div class="tabs">
          <div v-for="item in tabList" :key="item.key" class="tabs-item">
            <a-switch v-model:checked="item.enabled"/>
            {{ item.label }}
          </div>
        </div>
      </template>
      <template #right>
        <div class="right">
          <component :data="data" ref="componentsRef" :is="components[activeKey]" :disabled="!_dt.enabled"/>
        </div>
      </template>
    </EqualHeightColumns>
  </a-modal>
</template>

<script setup>
import TrafficAlarm from './TrafficAlarm.vue';
import {useI18n} from "vue-i18n";
import {onlyMessage} from "@jetlinks-web/utils";
import {update} from "@network-card-manager-ui/api/trafficPoolManagement";

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
  tabList.value[0].enabled = !!val?.alarmEnable
}, {
  immediate: true,
  deep: true
})

const onSave = async () => {
  const resp = await componentsRef.value.onSave()
  if(resp){
    loading.value = true;
    const res = await update(props.data.id, {
      alarmConfig: {
        ...resp,
        alarmLevel: 3
      },
      alarmEnable: _dt.value.enabled,
    }).finally(() => {
      loading.value = false;
    })
    if (res.success) {
      onlyMessage($t('CardManagement.index.427944-57'))
      emits('save')
    }
  }
}
</script>

<style lang="less" scoped>
.alarm-rule-box {
  .tabs {
    height: 100%;
    padding-right: 24px;
    overflow-y: auto;

    &-item {
      display: flex;
      gap: 16px;
      padding: 12px;
      background-color: @primary-1;
      cursor: pointer;
    }
  }

  .right {
    height: 100%;
    overflow-y: auto;
  }
}
</style>
