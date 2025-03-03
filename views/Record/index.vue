<!-- 操作记录 -->
<template>
  <j-page-container>
    <pro-search
      :columns="columns"
      target="record-search"
      @search="handleSearch"
    />
    <FullPage>
      <j-pro-table
        ref="RecordRef"
        :columns="columns"
        :request="queryList"
        :defaultParams="{
          sorts: [{ name: 'time', order: 'desc' }]
        }"
        :params="params"
        :mode="'TABLE'"
      >
        <template #type="slotProps">
          {{ slotProps.type?.text }}
        </template>
        <template #time="slotProps">
          {{
            slotProps.time
              ? dayjs(slotProps.time).format('YYYY-MM-DD HH:mm:ss')
              : ''
          }}
        </template>
      </j-pro-table>
    </FullPage>
  </j-page-container>
</template>

<script setup lang="ts">
import { queryList } from '../../api/record'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const params = ref<Record<string, any>>({})

const columns = [
  {
    title: $t('Record.index.705509-0'),
    dataIndex: 'cardId',
    key: 'cardId',
    ellipsis: true,
    search: {
      type: 'string'
    }
  },
  {
    title: $t('Record.index.705509-1'),
    dataIndex: 'type',
    key: 'type',
    scopedSlots: true,
    search: {
      type: 'select',
      options: [
        { label: $t('Record.index.705509-4'), value: 'active' },
        { label: $t('Record.index.705509-5'), value: 'deactivate' },
        { label: $t('Record.index.705509-6'), value: 'resumption' }
      ]
    }
  },
  {
    title: $t('Record.index.705509-2'),
    dataIndex: 'time',
    key: 'time',
    scopedSlots: true,
    search: {
      type: 'date'
    }
  },
  {
    title: $t('Record.index.705509-3'),
    dataIndex: 'operator',
    key: 'operator',
    ellipsis: true,
    search: {
      type: 'string'
    }
  }
]

const handleSearch = (e: any) => {
  params.value = e
}
</script>

<style scoped lang="less"></style>
