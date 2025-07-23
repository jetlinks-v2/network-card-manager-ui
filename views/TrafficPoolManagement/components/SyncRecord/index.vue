<template>
  <a-drawer :title="$t('Detail.index.427958-29')" visible :width="1100" @close="emits('close')">
    <pro-search
        :columns="columns"
        target="iot-card-management-sync-record-search"
        @search="handleSearch"
        style="padding: 0"
        type="simple"
    />
    <FullPage>
      <j-pro-table
          v-if="data.id"
          :columns="columns"
          :request="querySyncLog"
          :defaultParams="{
          sorts: [{ name: 'responseTime', order: 'desc' }]
        }"
          :params="params"
          mode="TABLE"
          style="padding: 0"
      >
        <template #responseTime="slotProps">
          {{slotProps.responseTime ? dayjs(slotProps.responseTime).format('YYYY-MM-DD HH:mm:ss') : "--"}}
        </template>
        <template #source="slotProps">
          {{slotProps.source === 'manual' ? '手动同步' : '自动同步'}}
        </template>
        <template #flowPercentage="slotProps">
          {{slotProps.flowPercentage !== undefined ? `${slotProps.flowPercentage.toFixed(2)}%` : '--'}}
        </template>
        <template #usedFlow="slotProps">
          {{slotProps.usedFlow !== undefined ? `${slotProps.usedFlow.toFixed(2)}M` : '--'}}
        </template>
        <template #residualFlow="slotProps">
          {{slotProps.residualFlow !== undefined ? `${slotProps.residualFlow.toFixed(2)}M` : '--'}}
        </template>
        <template #totalFlow="slotProps">
          {{slotProps.totalFlow !== undefined ? `${slotProps.totalFlow.toFixed(2)}M` : '--'}}
        </template>
        <template #exceeded="slotProps">
          {{ ((slotProps.usedFlow || 0) - (slotProps.totalFlow || 0)) > 0 ? `${((slotProps.usedFlow || 0) - (slotProps.totalFlow || 0))}M` : "--" }}
        </template>
      </j-pro-table>
      <j-empty v-else />
    </FullPage>
  </a-drawer>
</template>

<script setup>
import {querySyncLog} from "@networkCardManager/api/trafficPoolManagement";
import {useI18n} from "vue-i18n";
import dayjs from 'dayjs'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

const {t: $t} = useI18n();
const emits = defineEmits(['close'])

const columns = [
  {
    title: $t('CardManagement.index.427944-16'),
    dataIndex: 'responseTime',
    key: 'responseTime',
    scopedSlots: true,
    width: 180,
    search: {
      type: 'date'
    }
  },
  {
    title: $t('CardManagement.Sync.427942-4'),
    dataIndex: 'source',
    key: 'source',
    width: 120,
    ellipsis: true,
    scopedSlots: true,
    search: {
      type: 'select',
      options: [
        {
          label: '手动同步',
          value: 'manual'
        },
        {
          label: '自动同步',
          value: 'auto'
        }
      ]
    }
  },
  {
    title: $t('Detail.index.427958-11'),
    dataIndex: 'usedFlow',
    key: 'usedFlow',
    width: 120,
    ellipsis: true,
    scopedSlots: true,
    search: {
      type: 'number',
    }
  },
  {
    title: $t('CardManagement.Sync.427942-3'),
    dataIndex: 'exceeded',
    key: 'exceeded',
    ellipsis: true,
    scopedSlots: true,
    width: 120,
  },
  {
    title: $t('TrafficPoolManagement.Detail.index.390590-43'),
    dataIndex: 'residualFlow',
    key: 'residualFlow',
    ellipsis: true,
    scopedSlots: true,
    width: 120,
    search: {
      type: 'number',
    }
  },
  {
    title: $t('TrafficPoolManagement.Detail.index.390590-42'),
    key: 'totalFlow',
    dataIndex: 'totalFlow',
    ellipsis: true,
    scopedSlots: true,
    width: 120,
    search: {
      type: 'number',
    }
  },
  {
    title: $t('CardManagement.Sync.427942-5'),
    dataIndex: 'flowPercentage',
    key: 'flowPercentage',
    ellipsis: true,
    scopedSlots: true,
    width: 80,
    // search: {
    //   type: 'number',
    // }
  },
  {
    title: $t('TrafficPoolManagement.Detail.index.390590-45'),
    dataIndex: 'cardTotal',
    key: 'cardTotal',
    ellipsis: true,
    width: 80,
    search: {
      type: 'number',
    }
  },
  {
    title: $t('TrafficPoolManagement.Detail.index.390590-46'),
    dataIndex: 'cardUsedTotal',
    key: 'cardUsedTotal',
    ellipsis: true,
    width: 80,
    search: {
      type: 'number',
    }
  },
]

const params = ref({
  "terms": [
    {
      "value": props.data?.id,
      "termType": "eq",
      "column": "poolId",
      "terms": [
        {
          "value": false,
          "termType": "eq",
          "column": "error",

        }
      ]
    }
  ]
})
const handleSearch = (e) => {
  params.value = {
    "terms": [
      {
        "value": props.data?.id,
        "termType": "eq",
        "column": "poolId",
        "terms": [
          {
            "value": false,
            "termType": "eq",
            "column": "error",
            "terms": e.terms || []
          },
        ]
      }
    ]
  }
}
</script>

<style lang="less" scoped>

</style>
