<template>
  <div class="traffic-alarm">
    <div class="alert">
      <AIcon type="InfoCircleOutlined"/>
      <j-ellipsis>{{ $t('TrafficPoolManagement.Detail.index.390590-14') }}</j-ellipsis>
    </div>
    <p class="text">
      {{ $t('TrafficPoolManagement.Detail.index.390590-15') }}
      <span class="bold-text">{{ data.totalFlow?.toFixed(2) }}M</span>
    </p>
    <TitleComponent :data="$t('TrafficPoolManagement.Detail.index.390590-16')"/>
    <a-form layout="inline" ref="formRef" :model="formData">
      <div class="text">{{ $t('TrafficPoolManagement.Detail.index.390590-17') }}</div>
      <a-form-item name="type">
        <a-radio-group :disabled="disabled" button-style="solid" v-model:value="formData.type" @change="formData.value = undefined">
          <a-radio-button value="percent">{{ $t('TrafficPoolManagement.Detail.index.390590-27') }}</a-radio-button>
          <a-radio-button value="fixed">{{ $t('TrafficPoolManagement.Detail.index.390590-28') }}</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <div class="text">{{ $t('TrafficPoolManagement.Detail.index.390590-18') }}</div>
      <a-form-item name="value" :rules="[
        {
          required: true,
          message: $t('TrafficPoolManagement.Detail.index.390590-16')
        }
      ]">
        <a-input-number
            style="width: 100px"
            :addon-after="formData.type === 'percent' ? '%' : ''"
            v-model:value="formData.value"
            :disabled="disabled"
            :min="0"
            :max="formData.type === 'percent' ? 100 : 99999"
            :precision="formData.type === 'percent' ? 0 : 2"
        />
      </a-form-item>
      <div class="text">{{ $t('TrafficPoolManagement.Detail.index.390590-19') }}</div>
    </a-form>
  </div>
</template>

<script setup>
import {useI18n} from "vue-i18n";

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: () => ({})
  }
})
const {t: $t} = useI18n();
const formData = reactive({
  type: 'fixed',
  value: undefined,
});
const formRef = ref();

watch(() => props.data, (val) => {
  if(val.alarmConfig){
    formData.type = val.alarmConfig.flowTrafficThreshold === undefined ? 'fixed' : 'percent'
    formData.value = val.alarmConfig.flowTrafficThreshold || val.alarmConfig.flowThreshold
  }
}, {
  immediate: true,
  deep: true
})
const onSave = () => {
  return new Promise(async (resolve) => {
    const resp = await formRef.value.validate()
    if (resp) {
      const obj = {
        enabled: !props.disabled,
        type: "poolFLow",  //固定类型
      }
      if (resp.type === 'fixed') {
        obj.flowThreshold = resp.value
      } else {
        obj.flowTrafficThreshold = resp.value
      }
      resolve(obj)
    } else {
      resolve(false)
    }
  })
}

defineExpose({
  onSave
})
</script>

<style lang="less" scoped>
.traffic-alarm {
  :deep(.ant-form) {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .text {
    color: rgba(0, 0, 0, 0.55);
  }

  .bold-text {
    color: #000;
    font-weight: 600;
  }
}

.alert {
  height: 40px;
  padding-left: 10px;
  color: rgba(0, 0, 0, 0.55);
  line-height: 40px;
  background-color: #f6f6f6;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
