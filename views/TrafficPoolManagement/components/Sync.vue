<template>
  <a-modal visible title="同步" :closable="false">
    <p>{{ data }}张物联卡等待更新</p>
    <template #footer>
      <a-button type="primary" @click="onOk">完成</a-button>
    </template>
  </a-modal>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Number,
    default: 0
  }
})
const emit = defineEmits(['close'])
const onOk = () => {
  emit('close')
}
</script>

<style lang="less" scoped>

</style>
