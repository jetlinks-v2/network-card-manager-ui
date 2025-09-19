<template>
  <a-modal open :title="$t('CardManagement.index.427944-52')" :confirm-loading="loading" @cancel="emits('close')" @ok="handleSave">
    <a-form layout="vertical" ref="formRef" :model="formData">
      <a-form-item
          :label="$t('Detail.index.707691-2')"
          name="alias"
          :rules="[
              {
                  required: true,
                  message: $t('Save.index.902471-7'),
              },
              {
                  max: 64,
                  message: $t('Save.index.902471-3'),
              },
          ]"
      >
        <a-input
            v-model:value="formData.alias"
            :placeholder="$t('save.index.551811-5')"
        ></a-input>
      </a-form-item>
      <a-form-item :label="$t('save.index.551811-9')" name="description">
        <a-textarea
            :rows="4"
            :maxlength="200"
            showCount
            v-model:value="formData.description"
            :placeholder="$t('save.index.551811-10')"
        ></a-textarea>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import {useI18n} from "vue-i18n";
import {update} from "@network-card-manager-ui/api/trafficPoolManagement";
import {onlyMessage} from "@jetlinks-web/utils";

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})
const emits = defineEmits(['close', 'save'])
const {t: $t} = useI18n();
const loading = ref(false);
const formRef = ref();
const formData = reactive({
  alias: "",
  description: "",
});

watch(() => props.data, (newVal) => {
  formData.alias = newVal.alias || newVal.name;
  formData.description = newVal.description;
}, {
  deep: true,
  immediate: true,
})

const handleSave = async () => {
  const resp = await formRef.value.validate()
  if(resp){
    loading.value = true;
    const res = await update(props.data.id, formData).finally(() => {
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

</style>
