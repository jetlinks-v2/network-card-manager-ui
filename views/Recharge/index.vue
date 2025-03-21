<!-- 充值管理 -->
<template>
  <j-page-container>
    <pro-search
      :columns="columns"
      target="recharge-search"
      @search="handleSearch"
    />
    <FullPage>
      <j-pro-table
        ref="rechargeRef"
        :columns="columns"
        :request="queryRechargeList"
        mode="TABLE"
        :defaultParams="{
          sorts: [{ name: 'createTime', order: 'desc' }]
        }"
        :params="params"
      >
        <template #headerLeftRender>
          <a-space>
            <j-permission-button
              @click="visible = true"
              :hasPermission="'iot-card/Recharge:pay'"
              type="primary"
            >
              {{ $t('Recharge.index.444801-0') }}
            </j-permission-button>
            <div class="tips-text">
              <span style="margin-right: 8px; font-size: 16px">
                <AIcon type="ExclamationCircleOutlined"></AIcon>
              </span>
              {{ $t('Recharge.index.444801-1') }}
            </div>
          </a-space>
        </template>
        <template #paymentType="slotProps">
          {{paymentMethod.find(item => item.value === slotProps.paymentType)?.text || slotProps.paymentType}}
        </template>
        <template #createTime="slotProps">
          {{
            slotProps.createTime
              ? dayjs(slotProps.createTime).format('YYYY-MM-DD HH:mm:ss')
              : ''
          }}
        </template>
        <template #action="slotProps">
          <a-space :size="16">
            <template v-for="i in getActions(slotProps)" :key="i.key">
              <j-permission-button
                :disabled="i.disabled"
                :popConfirm="i.popConfirm"
                :tooltip="{
                  ...i.tooltip
                }"
                @click="i.onClick"
                type="link"
                style="padding: 0px"
                :hasPermission="'iot-card/Recharge:' + i.key"
              >
                <template #icon><AIcon :type="i.icon" /></template>
              </j-permission-button>
            </template>
          </a-space>
        </template>
      </j-pro-table>
    </FullPage>
    <!-- {{ $t('Recharge.index.444801-0') }} -->
    <Save v-if="visible" @change="saveChange" />
    <Detail v-if="detailVisible" :data="current" @close="close" />
  </j-page-container>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import {getPayType, queryRechargeList} from '../../api/cardManagement'
import Save from './Save.vue'
import Detail from './Detail.vue'
import { useI18n } from 'vue-i18n';
import {useRequest} from "@jetlinks-web/hooks";

const { t: $t, locale } = useI18n();
const rechargeRef = ref<Record<string, any>>({})
const params = ref<Record<string, any>>({})
const visible = ref<boolean>(false)
const detailVisible = ref<boolean>(false)
const current = ref<Record<string, any>>({})
const { data: paymentMethod } = useRequest(getPayType)

const columns = [
  {
    title: $t('Recharge.index.444801-2'),
    dataIndex: 'chargeMoney',
    key: 'chargeMoney',
    ellipsis: true,
    search: {
      type: 'string'
    }
  },
  {
    title: $t('Recharge.index.444801-3'),
    dataIndex: 'paymentType',
    key: 'paymentType',
    search: {
      type: 'select',
      options: () => {
        return paymentMethod.value.map(item => {
          return {
            label: item.text,
            value: item.value
          }
        })
      }
    },
    scopedSlots: true
  },
  {
    title: $t('Recharge.index.444801-4'),
    dataIndex: 'orderNumber',
    key: 'orderNumber',
    ellipsis: true
  },
  {
    title: $t('Recharge.index.444801-5'),
    dataIndex: 'url',
    key: 'url',
    ellipsis: true
  },
  {
    title: $t('Recharge.index.444801-6'),
    dataIndex: 'createTime',
    key: 'createTime',
    scopedSlots: true,
    width: 200,
    search: {
      type: 'date'
    }
  },
  {
    title: $t('Recharge.index.444801-7'),
    key: 'action',
    fixed: 'right',
    width: locale.value.includes('zh') ? 60 : 120,
    scopedSlots: true
  }
]

const getActions = (data: Partial<Record<string, any>>): any[] => {
  if (!data) return []
  return [
    {
      key: 'view',
      text: $t('Recharge.index.444801-8'),
      tooltip: {
        title: $t('Recharge.index.444801-8')
      },
      icon: 'EyeOutlined',
      onClick: () => {
        detailVisible.value = true
        current.value = data
      }
    }
  ]
}

const handleSearch = (e: any) => {
  params.value = e
}

/**
 * 充值关闭弹窗
 * @param val 加载表格
 */
const saveChange = (val: any) => {
  visible.value = false
  if (val) {
    setTimeout(() => {
      rechargeRef.value?.reload()
    }, 700)
  }
}

/**
 * 查看详情弹窗关闭
 */
const close = () => {
  detailVisible.value = false
}
</script>

<style scoped lang="less">
.tips-text {
  padding-left: 24px;
  background: #fff;
  font-size: 14px;
}
</style>
