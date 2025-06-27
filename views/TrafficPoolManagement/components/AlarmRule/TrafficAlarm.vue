<template>
  <div class="traffic-alarm">
    <div class="alert">
      <AIcon type="InfoCircleOutlined" />
      流量使用超出告警后，可在告警中心查看相关告警记录
    </div>
    <p class="text">
      当前套内生效总流量
      <span class="bold-text">300.00M</span>
    </p>
    <TitleComponent data="流量池告警" />
    <a-form layout="inline" ref="formRef" :model="formData">
      <div class="text">当前剩余流量</div>
      <a-form-item name="type">
        <a-radio-group :disabled="disabled" button-style="solid" v-model:value="formData.type">
          <a-radio-button value="percent">百分比</a-radio-button>
          <a-radio-button value="fixed">固定值</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <div class="text">低于</div>
      <a-form-item name="value" :rules="[
        {
          required: true,
          message: '请输入值'
        }
      ]">
        <a-input-number
            style="width: 100px"
            :addon-after="formData.type === 'percent' ? '%' : ''"
            v-model:value="formData.value"
            :disabled="disabled"
        />
      </a-form-item>
      <div class="text">触发告警</div>
    </a-form>
  </div>
</template>

<script setup>
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})
const formData = reactive({
  type: 'percent',
  value: 10,
});
const formRef = ref();
const onSave = () => {
  return new Promise(async (resolve) => {
    const resp = await formRef.value.validate()
    if(resp){
      resolve(resp)
    } else {
      resolve(false)
    }
  })
}

defineExpose({
  disabled: props.disabled,
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
}
</style>
