<template>
  <div style="display: flex; flex-direction: column; height: 100%;">
    <div class="flex _between">
      <div class="flex">
        <div>卡片列表</div>
        <j-permission-button
            v-if="!batchVisible"
            type="link"
            :hasPermission="true"
            @click="handleBatchDevice"
        >
          <AIcon type="NodeIndexOutlined"/>
          批量绑定设备
        </j-permission-button>
      </div>
      <j-permission-button
          v-if="batchVisible"
          type="primary"
          :hasPermission="true"
          @click="handleSave"
      >
        保存
      </j-permission-button>
    </div>
    <div class="box" >
      <div class="left">
        <pro-search
            :columns="columns"
            target="traffic-pool-management-card-list"
            @search="handleSearch"
            type="simple"
            style="padding: 16px 0; margin-bottom: 0"
        />
        <div style="min-height: 100px;flex: 1">
          <j-pro-table
              ref="platformRef"
              :columns="columns"
              :request="query"
              style="padding: 0"
              :defaultParams="{
          sorts: [{ name: 'createTime', order: 'desc' }]
        }"
              :params="params"
              mode="TABLE"
              :gridColumns="[1]"
          >
            <template #bindDevice>
              <div>点击绑定设备</div>
            </template>
          </j-pro-table>
        </div>
        <a-space>
          <a-badge text="在线" status="success" />
          <a-badge text="离线" status="error" />
          <a-badge text="禁用" status="warning" />
        </a-space>
      </div>
      <div v-if="batchVisible" class="right">
        <UnbindDevice />
      </div>
    </div>
  </div>
</template>

<script setup>
import {useI18n} from "vue-i18n";
import {query} from "@networkCardManager/api/cardManagement";
import UnbindDevice from './UnbindDevice.vue';

const {t: $t} = useI18n();
const columns = [
  {
    title: '卡号',
    dataIndex: 'id',
    key: 'di',
    fixed: 'left',
    ellipsis: true,
    width: 200,
    search: {
      type: 'string'
    }
  },
  {
    title: 'ICCID',
    dataIndex: 'ICCID',
    key: 'ICCID',
    ellipsis: true,
    search: {
      type: 'string'
    }
  },
  {
    title: '使用流量',
    dataIndex: 'a',
    key: 'a',
    ellipsis: true,
    search: {
      type: 'string'
    }
  },
  {
    title: '激活日期',
    dataIndex: 'updateTime1',
    key: 'updateTime1',
    width: 200,
    ellipsis: true,
    search: {
      type: 'date',
    },
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    width: 200,
    ellipsis: true,
    search: {
      type: 'date',
    },
  },
  {
    title: '平台状态',
    dataIndex: 'state',
    key: 'state',
    width: 100,
    ellipsis: true,
    search: {
      type: 'select',
      options: [
        {label: $t('Platform.index.838700-8'), value: 'enabled'},
        {label: $t('Platform.index.838700-9'), value: 'disabled'},
        {label: $t('Platform.index.838700-9'), value: 'disabled1'}
      ]
    }
  },
  {
    title: '运营商状态',
    dataIndex: 'state1',
    key: 'state1',
    ellipsis: true,
    width: 120,
    search: {
      type: 'select',
      options: [
        {label: $t('Platform.index.838700-8'), value: 'enabled'},
        {label: $t('Platform.index.838700-9'), value: 'disabled'},
        {label: $t('Platform.index.838700-9'), value: 'disabled1'}
      ]
    }
  },
  {
    title: '同步状态',
    dataIndex: 'state2',
    key: 'state2',
    width: 100,
    search: {
      type: 'select',
      options: [
        {label: $t('Platform.index.838700-8'), value: 'enabled'},
        {label: $t('Platform.index.838700-9'), value: 'disabled'},
        {label: $t('Platform.index.838700-9'), value: 'disabled1'}
      ]
    }
  },
  {
    title: '已绑定设备',
    dataIndex: 'bindDevice',
    key: 'bindDevice',
    scopedSlots: true,
    width: 200,
    fixed: 'right',
  },
]
const batchVisible = ref(false)
const params = ref()
const handleBatchDevice = () => {
  batchVisible.value = true
}

const handleSave = () => {
  batchVisible.value = false
}

const handleSearch = () => {

}
</script>

<style lang="less" scoped>
.flex {
  display: flex;
  align-items: center;
}

._between {
  justify-content: space-between;
}

.box {
  display: flex;
  min-height: 100px;
  flex: 1;

  .left {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .right {
    margin: 16px 0 0 24px;
    width: 400px;
    height: 100%;
  }
}
</style>
