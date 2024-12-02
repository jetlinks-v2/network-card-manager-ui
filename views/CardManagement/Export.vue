<template>
  <!-- 导入 -->
  <a-modal
    :maskClosable="false"
    :visible="true"
    title="导出"
    okText="确定"
    cancelText="取消"
    :confirmLoading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div style="margin-top: 10px">
      <a-space>
        <span>文件格式：</span>
        <a-radio-group
          v-model:value="type"
          placeholder="请选择文件格式"
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
import dayjs from 'dayjs';
import {_export} from '../../api/cardManagement';
import {downloadFileByUrl} from '@jetlinks-web/utils';
import {paramsEncodeQuery} from "@/utils/encodeQuery";
import {LocalStore} from "@jetlinks-web/utils";
import {TOKEN_KEY} from "@jetlinks-web/constants";

const emit = defineEmits(['close'])

const props = defineProps({
  data: {
    type: Object,
    default: undefined
  }
})

const type = ref<string>('xlsx');
const loading = ref<boolean>(false);

const handleOk = () => {
  loading.value = true
  const _params = paramsEncodeQuery(props.data);
  const urlParams = new URLSearchParams()

  Object.keys(_params).forEach(key => {
    if (_params[key]) {
      urlParams.append(key, _params[key])
    }
  })
  const url = `${origin}/api/network/card/download.${type.value}/_query?:X_Access_Token=${LocalStore.get(TOKEN_KEY)}&${urlParams}`
  window.open(url)
  loading.value = false
  emit('close');
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
}

const handleCancel = () => {
  emit('close')
}
</script>

<style scoped lang="less"></style>
