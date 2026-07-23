<template>
  <!-- 导入 -->
  <a-modal
    :maskClosable="false"
    :open="true"
    :title="$t('CardManagement.Export.427956-0')"
    :okText="$t('CardManagement.Export.427956-1')"
    :cancelText="$t('CardManagement.Export.427956-2')"
    :confirmLoading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div style="margin-top: 10px">
      <a-space>
        <span>{{ $t("CardManagement.Export.427956-3") }}</span>
        <a-radio-group
          v-model:value="type"
          :placeholder="$t('CardManagement.Export.427956-4')"
          button-style="solid"
        >
          <a-radio-button value="xlsx">xlsx</a-radio-button>
          <a-radio-button value="csv">csv</a-radio-button>
        </a-radio-group>
      </a-space>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { paramsEncodeQuery } from "@jetlinks-web-core/utils/encodeQuery";
import { getToken } from '@jetlinks-web/utils'
import { TOKEN_KEY_URL } from '@jetlinks-web/constants'
import { useI18n } from "vue-i18n";

const { t: $t } = useI18n();
const emit = defineEmits(["close"]);

const props = defineProps({
  data: {
    type: Object,
    default: undefined,
  },
  params: {
    type: Object,
    default: undefined,
  },
});

const type = ref<string>("xlsx");
const loading = ref<boolean>(false);

const handleOk = () => {
  loading.value = true;
  const _params = paramsEncodeQuery(props.data?.length ? props.data: (props.params || {}));
  const urlParams = new URLSearchParams();

  Object.keys(_params).forEach((key) => {
    if (_params[key]) {
      urlParams.append(key, _params[key]);
    }
  });
  const url = `${origin}/api/network/card/download.${type.value}/_query?${TOKEN_KEY_URL}=${getToken()}&${urlParams}`;
  window.open(url);
  loading.value = false;
  emit("close");
  // _export(type.value, props.data).then((res: any) => {
  //   if (res) {
  //     const blob = new Blob([res.data], {type: type.value})
  //     const url = URL.createObjectURL(blob)
  //     downloadFileByUrl(
  //       url,
  //       `物联卡管理-${dayjs(new Date()).format('YYYY/MM/DD HH:mm:ss')}`,
  //       type.value
  //     )
  //     emit('close')
  //   }
  // })
};

const handleCancel = () => {
  emit("close");
};
</script>

<style scoped lang="less"></style>
