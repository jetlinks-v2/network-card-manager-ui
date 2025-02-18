<template>
  <a-modal
    :maskClosable="false"
    width="1000px"
    :visible="true"
    :title="$t('Recharge.Detail.444790-0')"
    :okText="$t('Recharge.Detail.444790-1')"
    :cancelText="$t('Recharge.Detail.444790-2')"
    @ok="handleCancel"
    @cancel="handleCancel"
  >
    <div style="margin-top: 10px">
      <a-descriptions
        :column="2"
        bordered
        :contentStyle="{ minWidth: '300px' }"
        :labelStyle="{ minWidth: '120px' }"
      >
        <a-descriptions-item :label="$t('Recharge.Detail.444790-3')">{{
          data.chargeMoney || '--'
        }}</a-descriptions-item>
        <a-descriptions-item :label="$t('Recharge.Detail.444790-4')">{{
          data?.rechargeId || '--'
        }}</a-descriptions-item>
        <a-descriptions-item :label="$t('Recharge.Detail.444790-5')">{{
          data.configName || '--'
        }}</a-descriptions-item>
        <a-descriptions-item :label="$t('Recharge.Detail.444790-6')">{{
          data.orderNumber || '--'
        }}</a-descriptions-item>
        <a-descriptions-item :label="$t('Recharge.Detail.444790-7')">{{
          data.paymentType || '--'
        }}</a-descriptions-item>
        <a-descriptions-item :label="$t('Recharge.Detail.444790-8')">
            {{ data.url ? data.url : '--' }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('Recharge.Detail.444790-9')">{{
          data.createTime
            ? dayjs(data.createTime).format('YYYY-MM-DD HH:mm:ss')
            : '--'
        }}</a-descriptions-item>
      </a-descriptions>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const emit = defineEmits(['close'])

const props = defineProps({
  data: {
    type: Object,
    default: () => {}
  }
})

const handleCancel = () => {
  emit('close')
}
</script>
