<template>
  <a-modal
    :maskClosable="false"
    width="600px"
    :visible="true"
    :title="$t('Recharge.Save.444802-0')"
    :okText="$t('Recharge.Save.444802-1')"
    :cancelText="$t('Recharge.Save.444802-2')"
    @ok="handleOk"
    @cancel="handleCancel"
    :confirmLoading="btnLoading"
  >
    <div>
      <div class="modal-info">
        <AIcon
          type="ExclamationCircleOutlined"
          style="margin-right: 6px"
        />{{ $t('Recharge.Save.444802-3') }}
      </div>
      <a-form layout="vertical" ref="formRef" :rules="rules" :model="modelRef">
        <a-form-item :label="$t('Recharge.Save.444802-4')" name="configId">
          <a-select
            v-model:value="modelRef.configId"
            :options="configList"
            allowClear
            show-search
            style="width: 100%"
            :placeholder="$t('Recharge.Save.444802-5')"
            optionFilterProp="label"
          >
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('Recharge.Save.444802-6')" name="rechargeId">
          <a-input
            v-model:value="modelRef.rechargeId"
            :placeholder="$t('Recharge.Save.444802-7')"
          />
        </a-form-item>
        <a-form-item :label="$t('Recharge.Save.444802-8')" name="chargeMoney">
          <a-input-number
            allowClear
            :precision="2"
            style="width: 100%"
            v-model:value="modelRef.chargeMoney"
            :min="1"
            :max="500"
            :placeholder="$t('Recharge.Save.444802-9')"
          />
        </a-form-item>

        <a-form-item :label="$t('Recharge.Save.444802-10')" name="paymentType">
          <a-select
            allowClear
            :options="PaymentMethod"
            :field-names="{label: 'text'}"
            v-model:value="modelRef.paymentType"
            :placeholder="$t('Recharge.Save.444802-11')"
          >
          </a-select>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { queryPlatformNoPage, recharge, getPayType } from '../../api/cardManagement'
import { onlyMessage } from '@jetlinks-web/utils'
import { useI18n } from 'vue-i18n';
import { useRequest } from "@jetlinks-web/hooks";

const { t: $t } = useI18n();
const emit = defineEmits(['change', 'save'])

const { data: PaymentMethod } = useRequest(getPayType)
const btnLoading = ref<boolean>(false)
const configList = ref<Record<string, any>[]>([])

const formRef = ref()

const modelRef = reactive({
  configId: undefined,
  rechargeId: '',
  chargeMoney: undefined,
  paymentType: undefined
})

const rules = {
  configId: [
    {
      required: true,
      message: $t('Recharge.Save.444802-5')
    },
    {
      max: 64,
      message: $t('Recharge.Save.444802-12')
    }
  ],
  rechargeId: [
    {
      required: true,
      message: $t('Recharge.Save.444802-7')
    },
    {
      max: 64,
      message: $t('Recharge.Save.444802-12')
    }
  ],
  chargeMoney: [
    {
      required: true,
      message: $t('Recharge.Save.444802-13')
    }
    // {
    //     min: 1,
    //     max: 500,
    //     message: '请输入1~500之间的数字',
    // },
  ],
  paymentType: [
    {
      required: true,
      message: $t('Recharge.Save.444802-11')
    }
  ]
}

const queryProvidersList = () => {
  queryPlatformNoPage({
    paging: false,
    terms: [
      {
        terms: [
          {
            column: 'operatorName',
            termType: 'eq',
            value: 'onelink'
          },
          {
            column: 'state',
            termType: 'eq',
            value: 'enabled',
            type: 'and'
          }
        ]
      }
    ]
  }).then((res: any) => {
    configList.value = res.result.map((item: any) => ({
      label: item.name,
      value: item.id
    }))
  })
}

const handleCancel = () => {
  emit('change')
  formRef.value.resetFields()
}

const handleOk = () => {
  formRef.value
    .validate()
    .then(async () => {
      btnLoading.value = true
      const resp: any = await recharge(toRaw(modelRef))
      btnLoading.value = false
      if (resp.status === 200) {
        if (resp.result === $t('Recharge.Save.444802-14')) {
          onlyMessage($t('Recharge.Save.444802-15'), 'error')
        } else if (!resp.result) {
          onlyMessage($t('Recharge.Save.444802-16'), 'warning')
        } else {
          window.open(resp.result)
        }
        emit('change', true)
        formRef.value.resetFields()
      }
    })
    .catch((err: any) => {
      btnLoading.value = false
      console.log('error', err)
    })
}

queryProvidersList()
</script>

<style scoped lang="less">
.modal-info {
  color: rgba(0, 0, 0, 0.55);
  background-color: #f6f6f6;
  padding: 6px 12px;
  margin-bottom: 12px;
}
</style>
