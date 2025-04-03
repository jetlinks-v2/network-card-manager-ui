<template>
  <a-space align="end">
    <a-upload
      v-model:fileList="modelValue.upload"
      name="file"
      :action="FileStaticPath"
      :headers="{
        [TOKEN_KEY]: LocalStore.get(TOKEN_KEY)
      }"
      :maxCount="1"
      :showUploadList="false"
      @change="uploadChange"
      :accept="props?.file ? `.${props?.file}` : '.xlsx'"
      :before-upload="beforeUpload"
    >
      <a-button>
        <template #icon><AIcon type="UploadOutlined" /></template>
        {{ $t('CardManagement.UploadFile.427940-0') }}
      </a-button>
    </a-upload>
    <div style="margin-left: 20px">
      <a-space>
        {{ $t('CardManagement.UploadFile.427940-1') }}
        <a @click="downFile('xlsx')">.xlsx</a>
        <a @click="downFile('csv')">.csv</a>
      </a-space>
    </div>
  </a-space>
  <!-- <div style="margin-top: 20px" v-if="importLoading">
        <j-badge v-if="flag" status="processing" text="进行中" />
        <j-badge v-else status="success" text="已完成" />
        <span>总数量：{{ count }}</span>
        <p style="color: red">{{ errMessage }}</p>
    </div> -->
  <div class="importing-status" v-if="importStatus == 'importing'">
    <AIcon type="LoadingOutlined" />
    {{ $t('CardManagement.UploadFile.427940-2') }}
  </div>
  <div class="column" v-if="importStatus != 'wait'">
    <p>
      <AIcon style="color: #00a4ff" type="CheckOutlined" />{{ $t('CardManagement.UploadFile.427940-3') }}
      {{ successNumber }}
    </p>
    <span v-if="failNumber">
      <AIcon style="color: #e50012" type="CloseOutlined" />{{ $t('CardManagement.UploadFile.427940-4') }}
      {{ failNumber }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import { FileStaticPath } from '@/api/comm'
import {
  LocalStore,
  onlyMessage,
  getToken,
  downloadFileByUrl
} from '@jetlinks-web/utils'
import { exportCard } from '../../api/cardManagement'
import { TOKEN_KEY, TOKEN_KEY_URL, BASE_API } from '@jetlinks-web/constants'
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
type Emits = {
  (e: 'update:modelValue', data: string[]): void
}
const emit = defineEmits<Emits>()

const props = defineProps({
  // 组件双向绑定的值
  modelValue: {
    type: Array,
    default: () => []
  },
  product: {
    type: String,
    default: ''
  },
  file: {
    type: String,
    default: 'xlsx'
  }
})
type ImportStatus = 'wait' | 'importing' | 'done'
const importStatus = ref<ImportStatus>('wait') //导入进度
const importLoading = ref<boolean>(false)
const flag = ref<boolean>(false)
const count = ref<number>(0)
const detailFile = ref('')
const successNumber = ref<number>(0)
const failNumber = ref<number>(0)
const errorMessage = ref()

const downFile = async (type: string) => {
  const res: any = await exportCard(type)
  if (res) {
    const blob = new Blob([res], { type: type })
    const url = URL.createObjectURL(blob)
    downloadFileByUrl(url, $t('CardManagement.UploadFile.427940-5'), type)
  }
}

const beforeUpload = (_file: any) => {
  const fileType = props?.file === 'csv' ? 'csv' : 'xlsx'
  const isCsv = _file.type === 'text/csv'
  const isXlsx =
    _file.type ===
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  if (!isCsv && fileType !== 'xlsx') {
    onlyMessage($t('CardManagement.UploadFile.427940-6'), 'warning')
  }
  if (!isXlsx && fileType !== 'csv') {
    onlyMessage($t('CardManagement.UploadFile.427940-7'), 'warning')
  }
  return (isCsv && fileType !== 'xlsx') || (isXlsx && fileType !== 'csv')
}

const uploadChange = async (info: Record<string, any>) => {
  importLoading.value = true
  if (info.file.status === 'done') {
    // const resp: any = info.file.response || { result: '' };
    // flag.value = true;
    // _import(props.product, { fileUrl: resp.result })
    //     .then((response: any) => {
    //         count.value = response.result?.total || 0
    //         onlyMessage('导入成功');
    //         errMessage.value = '';
    //     })
    //     .catch((err) => {
    //         errMessage.value = err?.response?.data?.message || '导入失败'
    //     })
    //     .finally(() => {
    //         flag.value = false;
    //     });
    const resp: any = info.file.response || { result: '' }
    handleImport(resp)
  }
}

const handleImport = async (file: any) => {
  let message: any = []
  importStatus.value = 'importing'
  let event: EventSource
  event = new EventSource(
    `${BASE_API}/network/card/${
      props.product
    }/_import?${TOKEN_KEY_URL}=${getToken()}&fileUrl=${file.result.accessUrl}`,
    { withCredentials: true }
  )
  event.onopen = (e) => {
    // pushMessage.value = []
    console.log('open')
  }
  event.onmessage = (e) => {
    const result = JSON.parse(e.data)
    if (result.success) {
      successNumber.value += result.result?.total || 1
    } else {
      if (result.rowNumber !== -1) {
        failNumber.value += result.result?.total || 1
        message.push({
          rowNumber: $t('CardManagement.UploadFile.427940-8', [result.rowNumber]),
          message: result.message,
          name: result.name
        })
        errorMessage.value = JSON.stringify(message)
      } else {
        detailFile.value = result.detailFile
      }
    }
  }
  event.onerror = (err) => {
    importStatus.value = 'done'
    event.close()
  }
}
</script>
<style scoped lang="less">
.column {
  margin-top: 10px;
}
</style>
