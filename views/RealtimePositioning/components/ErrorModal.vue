<template>
  <a-modal visible title="失败记录" @cancel="emits('close')" :width="900">
    <a-button type="link" @click="onCopy">复制所有卡号</a-button>
    <a-table :dataSource="data" :columns="columns" :pagination="false" :scroll="{y: 500}">
      <template #bodyCell="{column, record}">
        <template v-if="column.key === 'platformType'">
          {{OperatorMap[record[column.key]]}}
        </template>
      </template>
    </a-table>
    <template #footer>
      <a-button @click="emits('close')">关闭</a-button>
    </template>
  </a-modal>
</template>

<script setup>
import {OperatorMap} from "@networkCardManager/views/data";
import {onlyMessage} from "@jetlinks-web/utils";

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

const emits = defineEmits(['close'])

const columns = [
  {
    title: '卡号',
    dataIndex: 'cardId',
    key: 'cardId',
    ellipsis: true
  },
  {
    title: 'ICCID',
    dataIndex: 'iccId',
    key: 'iccId',
    ellipsis: true
  },
  {
    title: '运营商',
    dataIndex: 'platformType',
    key: 'platformType',
    ellipsis: true
  },
  {
    ellipsis: true,
    title: '失败原因',
    dataIndex: 'errorMessage',
    key: 'errorMessage',
  },
]

const onCopy = () => {
  const text = props.data.map(item => item.cardId).join('\n')
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
    onlyMessage('复制成功！');
  }
}
</script>

<style lang="less" scoped>

</style>
