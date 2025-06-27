<template>
  <j-page-container
      :tabList="tabList"
      :showBack="true"
      :tabActiveKey="tabActiveKey"
      @tabChange="onTabChange"
  >
    <template #title>
      <j-ellipsis>{{ info.id }}</j-ellipsis>
    </template>
    <template #content>
      <a-descriptions size="small" :column="4">
        <a-descriptions-item label="运营商">{{info.id}}</a-descriptions-item>
        <a-descriptions-item label="说明">
          {{info.description || '--'}}
        </a-descriptions-item>
      </a-descriptions>
    </template>
    <template #extra>
      <a-space>
        <j-permission-button
            :hasPermission="true"
            @click="handleAlarm"
        >
          <AIcon type="AlertOutlined"/>
          告警规则
        </j-permission-button>
        <j-permission-button
            :hasPermission="true"
            @click="handleEdit"
        >
          <AIcon type="EditOutlined"/>
          编辑
        </j-permission-button>
        <j-permission-button
            :hasPermission="'iot-card/Platform:add'"
            type="primary"
            @click="handleSyncClick"
        >
          <AIcon type="SyncOutlined"/>
          同步状态
        </j-permission-button>
      </a-space>
    </template>
    <full-page>
      <div style="height: 100%; padding: 24px;overflow-y: auto">
        <component :is="tabs[tabActiveKey]"/>
      </div>
    </full-page>
  </j-page-container>
  <Sync v-if="sync.visible" :data="sync.num" @close="sync.visible = false" />
  <Edit v-if="edit.visible" :data="edit.data" @close="edit.visible = false" />
  <AlarmRule v-if="alarmRule.visible" :data="alarmRule.data" @close="alarmRule.visible = false" />
</template>

<script setup>
import {tabs} from './asyncComponent'
import {queryDetail} from "@networkCardManager/api/cardManagement";
import Sync from "../components/Sync.vue";
import Edit from "../components/Edit.vue";
import AlarmRule from "../components/AlarmRule/index.vue";

const route = useRoute();

const tabActiveKey = ref('DataOverview')
const info = ref({})
const sync = reactive({
  visible: false,
  num: 9
})
const edit = reactive({
  visible: false,
  data: {}
})

const alarmRule = reactive({
  visible: false,
  data: {}
})
const tabList = [
  {
    key: 'DataOverview',
    tab: '数据概览',
  },
  {
    key: 'CardList',
    tab: '卡片概览'
  },
];

const getDetailFn = async () => {
  const _id = route.params?.id;
  if (_id) {
    const resp = await queryDetail(_id)
    if (resp.success) {
      info.value = resp.result
    }
  }
};

const onTabChange = (e) => {
  tabActiveKey.value = e;
};

const handleSyncClick = () => {
  sync.visible = true
}

const handleEdit = () => {
  edit.visible = true
  edit.data = info.value
}

const handleAlarm = () => {
  alarmRule.visible = true
  alarmRule.data = info.value
}

onMounted(() => {
  getDetailFn();
});
</script>

