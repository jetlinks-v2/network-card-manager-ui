<template>
  <a-modal visible title="编辑" :confirm-loading="loading" @cancel="emits('close')" @ok="handleSave">
    <a-form layout="vertical" ref="formRef" :model="formData">
      <a-form-item
          label="名称"
          name="name"
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
            v-model:value="formData.name"
            :placeholder="$t('save.index.551811-5')"
        ></a-input>
      </a-form-item>
      <a-form-item :label="$t('save.index.551811-9')" name="describe">
        <a-textarea
            :rows="4"
            :maxlength="200"
            v-model:value="formData.describe"
            :placeholder="$t('save.index.551811-10')"
        ></a-textarea>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import {useI18n} from "vue-i18n";

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
  name: "",
  describe: "",
});

watch(() => props.data, (newVal) => {
  formData.name = newVal.name;
  formData.describe = newVal.describe;
})

const handleSave = () => {

}
</script>

<style lang="less" scoped>

</style>
