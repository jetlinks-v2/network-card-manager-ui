<template>
  <a-modal visible :title="$t('RealtimePositioning.index.390590-1')" :mask-closable="false" @cancel="emits('close')" @ok="onSave">
    <a-alert style="margin-bottom: 16px" :message="$t('RealtimePositioning.index.390590-2')" />
    <a-form :model="formData" ref="formRef" layout="vertical">
      <a-form-item :label="`ICCID/${$t('CardManagement.index.427944-6')}`" name="cardIds" required>
        <a-textarea :rows="5" v-model:value="formData.cardIds" :placeholder="$t('RealtimePositioning.index.390590-3')" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import {useI18n} from "vue-i18n";

const emits = defineEmits(['close', 'save'])

const {t: $t} = useI18n();
const formRef = ref()
const formData = reactive({
  cardIds: undefined
})

const onSave = async () => {
 const resp = await formRef.value.validate()
  if(resp){
    const arr = (formData.cardIds?.split('\n') || []).slice(0, 50)
    emits('save', arr)
  }
}
</script>

<style lang="less" scoped>

</style>
