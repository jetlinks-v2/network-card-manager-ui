<template>
  <a-modal
    :maskClosable="false"
    width="600px"
    :visible="true"
    :title="type === 'add' ? '新增' : '编辑'"
    okText="确定"
    cancelText="取消"
    @ok="handleOk"
    @cancel="handleCancel"
    :confirmLoading="btnLoading"
  >
    <div style="margin-top: 10px">
      <a-form
        :layout="'vertical'"
        ref="formRef"
        :rules="rules"
        :model="modelRef"
      >
        <a-form-item label="卡号" name="id">
          <a-input
            v-model:value="modelRef.id"
            placeholder="请输入卡号"
            :disabled="type === 'edit'"
          ></a-input>
        </a-form-item>
        <a-form-item name="iccId">
          <template #label>
            <span>
              ICCID
              <a-tooltip title="IC卡的唯一识别号码">
                <AIcon type="QuestionCircleOutlined" style="margin-left: 2px" />
              </a-tooltip>
            </span>
          </template>
          <a-input
            v-model:value="modelRef.iccId"
            placeholder="请输入ICCID"
            :disabled="type === 'edit'"
          />
        </a-form-item>
        <a-form-item label="运营商" name="operatorName">
          <a-select
            allowClear
            showSearch
            :filter-option="filterOption"
            :disabled="type === 'edit'"
            :options="OperatorList"
            v-model:value="modelRef.operatorName"
            placeholder="请选择运营商"
            @select="
              () => {
                modelRef.platformConfigId = undefined
              }
            "
          >
          </a-select>
        </a-form-item>
        <a-form-item label="平台对接" name="platformConfigId">
          <a-select
            showSearch
            :filter-option="filterOption"
            :disabled="type === 'edit'"
            allowClear
            :options="platformConfigList"
            v-model:value="modelRef.platformConfigId"
            placeholder="请选择平台对接"
          >
          </a-select>
        </a-form-item>

        <a-form-item label="类型" name="cardType">
          <a-select
            allowClear
            showSearch
            :disabled="type === 'edit'"
            :filter-option="filterOption"
            :options="TypeList"
            v-model:value="modelRef.cardType"
            placeholder="请选择类型"
          >
          </a-select>
        </a-form-item>
        <a-form-item label="说明" name="describe">
          <a-textarea
            v-model:value="modelRef.describe"
            placeholder="请输入说明"
            showCount
            :maxlength="200"
          />
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import {
  queryPlatformNoPage,
  validateId,
  add,
  edit
} from '../../api/cardManagement'
import { onlyMessage } from '@jetlinks-web/utils'
import { OperatorList, TypeList } from '../data'

const emit = defineEmits(['change'])
const props = defineProps({
  type: {
    type: String
  },
  data: {
    type: Object,
    default: undefined
  }
})

const btnLoading = ref<boolean>(false)
const platformConfigCacheList = ref<Record<string, any>[]>([])

const formRef = ref()

const modelRef = reactive({
  id: '',
  iccId: '',
  platformConfigId: undefined,
  operatorName: undefined,
  cardType: undefined,
  describe: ''
})

const isValidateId = async (id: string) => {
  const res: any = await validateId(id)
  if (res.status === 200) {
    if (res.result?.passed) {
      return ''
    } else {
      return res.result.reason
    }
  } else {
    return '请输入输入正确的ICCID'
  }
}

const vailIccId = async (_: Record<string, any>, value: string) => {
  if (value) {
    const validateId = props.type === 'add' ? await isValidateId(value) : ''
    if (validateId === '') {
      return Promise.resolve()
    } else {
      return Promise.reject(new Error(`${validateId}`))
    }
    // } else {
    //     return Promise.reject(new Error('请输入卡号'));
  }
}

const rules = {
  id: [
    {
      required: true,
      message: '请输入卡号'
    },
    {
      max: 64,
      message: '最多输入64个字符'
    },
    {
      validator: vailIccId,
      trigger: 'blur'
    }
  ],
  iccId: [
    {
      required: true,
      message: '请输入ICCID'
    },
    {
      max: 64,
      message: '最多输入64个字符'
    }
  ],
  platformConfigId: [
    {
      required: true,
      message: '请选择平台对接'
    }
  ],
  operatorName: [
    {
      required: true,
      message: '请选择运营商'
    }
  ],
  cardType: [
    {
      required: true,
      message: '请选择类型'
    }
  ]
}

const filterOption = (input: string, option: any) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
}

const platformConfigList = computed(() => {
  return platformConfigCacheList.value
    .filter((item) => item.operatorName === modelRef.operatorName)
    .map((item) => ({ label: item.name, value: item.id }))
})

watch(
  () => props.data,
  (newValue) => {
    queryPlatformNoPage({
      paging: false,
      sorts: [{ name: 'createTime', order: 'desc' }],
      terms: [{ column: 'state', value: 'enabled' }]
    }).then((resp: any) => {
      if (resp.status === 200) {
        platformConfigCacheList.value = resp.result
      }
    })
    Object.assign(modelRef, newValue)
  },
  { immediate: true, deep: true }
)

const handleCancel = () => {
  emit('change', false)
  formRef.value.resetFields()
}

const handleOk = () => {
  formRef.value
    .validate()
    .then(async () => {
      btnLoading.value = true
      const resp =
        props.type === 'add'
          ? await add(toRaw(modelRef)).catch((err) => err)
          : await edit(toRaw(modelRef)).catch((err) => err)
      btnLoading.value = false
      if (resp.status === 200) {
        onlyMessage('操作成功')
        emit('change', true)
        formRef.value.resetFields()
      }
    })
    .catch((err: any) => {
      console.log('error', err)
    })
}
</script>
