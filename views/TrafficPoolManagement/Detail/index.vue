<template>
  <j-page-container
      :tabList="tabList"
      :showBack="true"
      :tabActiveKey="tabActiveKey"
      @tabChange="onTabChange"
  >
    <template #title>
      <div style="width: 500px;white-space: normal;">
        <j-ellipsis>{{ info.alias || info.name }}</j-ellipsis>
      </div>
    </template>
    <template #content>
      <a-descriptions size="small" :column="4">
        <a-descriptions-item :label="$t('TrafficPoolManagement.Detail.index.390590-0')">{{info.platformType?.text || '--'}}</a-descriptions-item>
        <a-descriptions-item :label="$t('Detail.index.707691-23')">
          <j-ellipsis>{{info.description || '--'}}</j-ellipsis>
        </a-descriptions-item>
      </a-descriptions>
    </template>
    <template #extra>
      <a-space>
        <j-permission-button
            :hasPermission="'iot-card/TrafficPoolManagement:update'"
            @click="handleAlarm"
        >
          <AIcon type="AlertOutlined"/>
          {{ $t('TrafficPoolManagement.Detail.index.390590-2') }}
        </j-permission-button>
        <j-permission-button
            :hasPermission="'iot-card/TrafficPoolManagement:update'"
            @click="handleEdit"
        >
          <AIcon type="EditOutlined"/>
          {{$t('CardManagement.index.427944-52')}}
        </j-permission-button>
        <j-permission-button
            :hasPermission="'iot-card/TrafficPoolManagement:update'"
            type="primary"
            @click="handleSyncClick"
        >
          <AIcon type="SyncOutlined"/>
          {{ $t('TrafficPoolManagement.index.390590-0') }}
        </j-permission-button>
      </a-space>
    </template>
    <full-page>
      <div style="height: 100%; padding: 24px;overflow-y: auto">
        <component :is="tabs[tabActiveKey]" ref="tabRef" />
      </div>
    </full-page>
  </j-page-container>
  <Sync v-if="sync.visible" :data="sync.data" @close="sync.visible = false" />
  <Edit v-if="edit.visible" :data="edit.data" @close="edit.visible = false" @save="onSave" />
  <AlarmRule v-if="alarmRule.visible" :data="alarmRule.data" @close="alarmRule.visible = false" @save="onSave" />
</template>

<script setup>
import {tabs} from './asyncComponent'
import Sync from "../components/Sync.vue";
import Edit from "../components/Edit.vue";
import AlarmRule from "../components/AlarmRule/index.vue";
import {useI18n} from "vue-i18n";
import {queryDetailById} from "@network-card-manager-ui/api/trafficPoolManagement";
import {TRAFFIC_POOL_INFO_KEY} from "./utils"
import {EventEmitter} from "@jetlinks-web/utils";

const {t: $t} = useI18n();
const route = useRoute();

const tabActiveKey = ref('DataOverview')
const info = ref({})
const tabRef = ref()

provide(TRAFFIC_POOL_INFO_KEY, info)

const sync = reactive({
  visible: false,
  data: {}
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
    tab: $t('TrafficPoolManagement.Detail.index.390590-5'),
  },
  {
    key: 'CardList',
    tab: $t('TrafficPoolManagement.Detail.index.390590-6')
  },
];

const getDetailFn = async () => {
  const _id = route.params?.id;
  if (_id) {
    const resp = await queryDetailById(_id)
    if (resp.success) {
      info.value = resp.result
    }
  }
};

const onTabChange = async (e) => {
  if(e === 'DataOverview' && tabRef.value) {
    tabRef.value.onLeaveChange(() => {
      tabActiveKey.value = e;
    })
  } else {
    tabActiveKey.value = e;
  }
};

const handleSyncClick = () => {
  sync.visible = true
  sync.data = info.value || {}
}

const handleEdit = () => {
  edit.visible = true
  edit.data = info.value
}

const handleAlarm = () => {
  alarmRule.visible = true
  alarmRule.data = info.value
}

const onSave = () => {
  edit.visible = false
  alarmRule.visible = false
  getDetailFn();
}

onMounted(() => {
  getDetailFn();
});
</script>

