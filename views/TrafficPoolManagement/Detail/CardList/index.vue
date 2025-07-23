<template>
  <div style="display: flex; flex-direction: column; height: 100%;" v-if="info.id">
    <div class="flex _between">
      <div class="flex">
        <div>{{ $t('TrafficPoolManagement.Detail.index.390590-6') }}</div>
        <j-permission-button
            v-if="!batchVisible"
            type="link"
            :hasPermission="'iot-card/TrafficPoolManagement:update'"
            @click="handleBatchDevice"
        >
          <AIcon type="NodeIndexOutlined"/>
          {{ $t('TrafficPoolManagement.Detail.index.390590-21') }}
        </j-permission-button>
      </div>
      <j-permission-button
          v-if="batchVisible"
          type="primary"
          :hasPermission="'iot-card/TrafficPoolManagement:update'"
          @click="handleSave"
      >
        {{ $t('Detail.index.707691-25') }}
      </j-permission-button>
    </div>
    <div class="box">
      <div class="left">
        <pro-search
            :columns="columns"
            target="traffic-pool-management-card-list"
            @search="handleSearch"
            type="simple"
            style="padding: 16px 0; margin-bottom: 0"
        />
        <div style="min-height: 100px;flex: 1">
          <a-dropdown
              :trigger="['contextmenu']"
              :visible="menuVisible"
              @visible-change="handleVisible"
          >
            <template #overlay>
              <a-menu @click="handleMenuClick">
                <template v-if="_selectedRowKeys.length > 0">
                  <a-menu-item key="batch-stop">
                    <a-button type="text">
                      <AIcon type="StopOutlined"/>
                      {{ $t('CardManagement.index.427944-70') }}
                    </a-button>
                  </a-menu-item>
                  <a-menu-item key="batch-reopen">
                    <a-button type="text">
                      <AIcon type="NodeIndexOutlined"/>
                      {{ $t('CardManagement.index.427944-72') }}
                    </a-button>
                  </a-menu-item>
                  <a-menu-item key="batch-unbind">
                    <a-button type="text">
                      <AIcon type="StopOutlined"/>
                      {{ $t('TrafficPoolManagement.Detail.index.390590-29') }}
                    </a-button>
                  </a-menu-item>
                  <a-menu-item key="batch-delete">
                    <a-button type="text" danger>
                      <AIcon type="DeleteOutlined"/>
                      {{ $t('CardManagement.index.427944-74') }}
                    </a-button>
                  </a-menu-item>
                </template>
                <template v-else-if="rowValue.id">
                  <a-menu-item key="reopen" v-if="rowValue.cardStateType?.value === 'deactivate'">
                    <a-button type="text">
                      <AIcon type="StopOutlined"/>
                      {{ $t('Record.index.705509-6') }}
                    </a-button>
                  </a-menu-item>
                  <a-menu-item key="stop" v-else>
                    <a-button type="text">
                      <AIcon type="StopOutlined"/>
                      {{ $t('CardManagement.index.427944-27') }}
                    </a-button>
                  </a-menu-item>
                  <a-menu-item key="bind" v-if="!rowValue.deviceId">
                    <a-button type="text">
                      <AIcon type="NodeIndexOutlined"/>
                      {{ $t('CardManagement.index.427944-4') }}
                    </a-button>
                  </a-menu-item>
                  <a-menu-item key="unbind" v-else>
                    <a-button type="text">
                      <AIcon type="NodeIndexOutlined"/>
                      {{ $t('CardManagement.index.427944-53') }}
                    </a-button>
                  </a-menu-item>
                  <a-menu-item key="delete">
                    <a-button type="text" danger>
                      <AIcon type="DeleteOutlined"/>
                      {{ $t('CardManagement.index.427944-62') }}
                    </a-button>
                  </a-menu-item>
                </template>
              </a-menu>
            </template>
            <j-pro-table
                :request="queryDetailList"
                ref="tableRef"
                :params="params"
                :columns="columns"
                mode="TABLE"
                style="padding: 0"
                :customRow="
                  (record) => ({
                      onContextmenu: (e) =>
                          handleRow(e, record),
                  })
              "
                :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }],
                    terms: [
                        {
                            column: 'poolId',
                            value: info?.id || '',
                            termType: 'eq',
                        },
                    ],
                }"
                :rowSelection="{
                    selectedRowKeys: _selectedRowKeys,
                    onChange: onSelectChange,
                }"
            >
              <template #id="slotProps">
                <a @click="handleClick(slotProps)">{{ slotProps.id }}</a>
              </template>
              <template #usedFlow="slotProps">
                <div>
                  {{ slotProps.usedFlow ? slotProps.usedFlow.toFixed(2) + ' M' : '--' }}
                </div>
              </template>
              <template #activationDate="slotProps">
                {{ slotProps.activationDate ? dayjs(slotProps.activationDate).format('YYYY-MM-DD HH:mm:ss') : '--' }}
              </template>
              <template #updateTime="slotProps">
                {{ slotProps.updateTime ? dayjs(slotProps.updateTime).format('YYYY-MM-DD HH:mm:ss') : '--' }}
              </template>
              <template #cardStateType="slotProps">
                <j-badge-status
                    :status="slotProps.cardStateType?.value"
                    :text="slotProps.cardStateType?.text"
                    :statusNames="{
                    using: 'processing',
                    toBeActivated: 'default',
                    deactivate: 'error'
                  }"
                />
              </template>
              <template #cardState="slotProps">
                <j-badge-status
                    v-if="slotProps.cardState?.value"
                    :status="slotProps.cardState?.value"
                    :text="slotProps.cardState?.text"
                    :statusNames="{
                      using: 'processing',
                      toBeActivated: 'default',
                      deactivate: 'error'
                    }"
                />
                <span v-else>--</span>
              </template>
              <template #syncCardStatus="slotProps">
                <span>{{ slotProps.syncCardStatus?.text || '--' }}</span>
              </template>
              <template #bindDevice="record">
                <div
                    class="bind-device unbind"
                    v-if="batchVisible && !dataObj[record.id]?.deviceId && !record.deviceId"
                    :class="record.index === activeOverIndex ? 'active' : ''"
                    @drop="(e) => onDrop(e, record)"
                    @dragover="(e) => dragover(e, record.index)"
                    @dragleave="dragleave"
                >{{ $t('TrafficPoolManagement.Detail.index.390590-44') }}
                </div>
                <div class="bind-device bind" v-else-if="dataObj[record.id]?.deviceId">
                  <div class="bind-left">
                    <a-badge
                        :status="statusMap.get(dataObj[record.id]?.state?.value)"
                    />
                    <j-ellipsis>{{
                        `${dataObj[record.id].deviceName || "--"}(${dataObj[record.id]?.deviceId || "--"})`
                      }}
                    </j-ellipsis>
                  </div>
                  <a-button type="link" @click="onRemove(record)">
                    <AIcon type="CloseOutlined"/>
                  </a-button>
                </div>
                <div
                    class="bind-device unbind"
                    v-else-if="!record.deviceId"
                    @click="onClick(record)"
                >{{ $t('TrafficPoolManagement.Detail.index.390590-23') }}
                </div>
                <div class="bind-device bind" v-else>
                  <div class="bind-left">
                    <a-badge
                        :status="statusMap.get(record?.deviceStatus?.value)"
                    />
                    <j-ellipsis>{{ `${record.deviceName || "--"}(${record.deviceId || "--"})` }}</j-ellipsis>
                  </div>
                  <j-permission-button
                      type="link"
                      :tooltip="{
                        title: $t('CardManagement.index.427944-53'),
                      }"
                      :popConfirm="{
                        title: $t('CardManagement.index.427944-54'),
                        okText: $t('CardManagement.index.427944-55'),
                        cancelText: $t('CardManagement.index.427944-56'),
                        onConfirm: () => {
                          onUnbind(record)
                        }
                      }"
                  >
                    <AIcon type="DisconnectOutlined"/>
                  </j-permission-button>
                </div>
              </template>
            </j-pro-table>
          </a-dropdown>
        </div>
        <a-space>
          <a-badge :text="$t('CardManagement.BindDevice.427957-8')" status="success"/>
          <a-badge :text="$t('CardManagement.BindDevice.427957-7')" status="error"/>
          <a-badge :text="$t('CardManagement.BindDevice.427957-6')" status="warning"/>
        </a-space>
      </div>
      <div v-if="batchVisible" class="right">
        <UnbindDevice :data="_bindData"/>
      </div>
    </div>
  </div>
  <BindDevice
      v-if="bind.visible"
      :cardId="bind.data.id"
      @change="onRefresh"
  />
</template>

<script setup>
import {useI18n} from "vue-i18n";
import {
  del, queryDetailList,
  removeCards,
  resumptionBatch,
  unDeploy,
  unDeployBatch
} from "@networkCardManager/api/cardManagement";
import UnbindDevice from './UnbindDevice.vue';
import BindDevice from '@networkCardManager/views/CardManagement/BindDevice.vue';
import {Modal} from "ant-design-vue";
import {TRAFFIC_POOL_INFO_KEY} from "@networkCardManager/views/TrafficPoolManagement/Detail/utils";
import {resumption, unbind} from "@networkCardManager/api/cardManagement";
import {onlyMessage} from "@jetlinks-web/utils";
import {batchBindDevice} from "@networkCardManager/api/trafficPoolManagement";
import {useMenuStore} from "@/store";
import dayjs from "dayjs";

import {debounce} from "lodash-es";

const {t: $t} = useI18n();

const info = inject(TRAFFIC_POOL_INFO_KEY, ref({}))
const columns = [
  {
    title: $t('CardManagement.index.427944-6'),
    dataIndex: 'id',
    key: 'id',
    fixed: 'left',
    ellipsis: true,
    width: 200,
    scopedSlots: true,
    search: {
      type: 'string'
    }
  },
  {
    title: 'ICCID',
    dataIndex: 'iccId',
    key: 'iccId',
    ellipsis: true,
    search: {
      type: 'string'
    }
  },
  {
    title: $t('Detail.index.427958-11'),
    dataIndex: 'usedFlow',
    key: 'usedFlow',
    ellipsis: true,
    scopedSlots: true,
    search: {
      type: 'string'
    }
  },
  {
    title: $t('CardManagement.index.427944-15'),
    dataIndex: 'activationDate',
    key: 'activationDate',
    width: 200,
    scopedSlots: true,
    search: {
      type: 'date',
    },
  },
  {
    title: $t('CardManagement.index.427944-16'),
    dataIndex: 'updateTime',
    key: 'updateTime',
    width: 200,
    scopedSlots: true,
    search: {
      type: 'date',
    },
  },
  {
    title: $t('CardManagement.index.427944-17'),
    dataIndex: 'cardStateType',
    key: 'cardStateType',
    width: 120,
    ellipsis: true,
    scopedSlots: true,
    search: {
      type: 'select',
      options: [
        {label: $t('CardManagement.index.427944-18'), value: 'notReady'},
        {label: $t('CardManagement.index.427944-19'), value: 'error'},
        {label: $t('CardManagement.index.427944-20'), value: 'using'},
        {label: $t('CardManagement.index.427944-21'), value: 'toBeActivated'},
        {label: $t('CardManagement.index.427944-22'), value: 'deactivate'},
        {label: $t('CardManagement.index.427944-23'), value: 'other'}
      ]
    }
  },
  {
    title: $t('CardManagement.index.427944-2'),
    dataIndex: 'cardState',
    key: 'cardState',
    width: 120,
    ellipsis: true,
    scopedSlots: true
  },
  {
    title: $t('CardManagement.index.427944-47'),
    dataIndex: 'syncCardStatus',
    key: 'syncCardStatus',
    width: 100,
    ellipsis: true,
    search: {
      type: 'select',
      options: [
        {label: $t('CardManagement.index.427944-18'), value: 'notSync'},
        {label: $t('CardManagement.index.427944-48'), value: 'waiting'},
        {label: $t('CardManagement.index.427944-49'), value: 'running'},
        {label: $t('CardManagement.index.427944-19'), value: 'failed'},
        {label: $t('CardManagement.index.427944-50'), value: 'success'},
      ],
    },
    scopedSlots: true
  },
  {
    title: $t('TrafficPoolManagement.Detail.index.390590-22'),
    dataIndex: 'bindDevice',
    key: 'bindDevice',
    scopedSlots: true,
    width: 300,
    fixed: 'right',
  },
]
const batchVisible = ref(false)
const menuVisible = ref(false)
const params = ref()
const activeOverIndex = ref(-1)
const rowValue = ref({})
const _selectedRowKeys = ref([])
const bind = reactive({
  visible: false,
  data: {}
})
const tableRef = ref()
const statusMap = new Map()
statusMap.set('online', 'processing')
statusMap.set('offline', 'error')
statusMap.set('notActive', 'warning')

const dataObj = ref({})
const menuStore = useMenuStore()

const handleBatchDevice = () => {
  batchVisible.value = true
}

const _bindData = computed(() => {
  return Object.keys(dataObj.value).filter(_key => !!dataObj.value[_key]?.deviceId).map(key => {
    return dataObj.value[key]
  })
})

const onSaveBindDevice = async (arr, next) => {
  const resp = await batchBindDevice(arr)
  if (resp.success) {
    next?.()
  }
}

const handleSave = async () => {
  const arr = Object.keys(dataObj.value).filter(_key => !!dataObj.value[_key]?.deviceId).map(key => {
    return {
      "cardId": key,
      "deviceId": dataObj.value[key].deviceId
    }
  })
  if (!arr.length) {
    onlyMessage('请选择绑定数据', 'error')
    return
  }
  onSaveBindDevice(arr, () => {
    batchVisible.value = false
    dataObj.value = {}
    onlyMessage($t('CardManagement.index.427944-57'))
    tableRef.value.reload()
  })
}

const handleSearch = (e) => {
  params.value = e
}

const handleRow = (e, record) => {
  e.preventDefault();
  rowValue.value = record;
  menuVisible.value = true
}

const onSelectChange = (keys) => {
  _selectedRowKeys.value = [...keys];
  rowValue.value = {};
}

const handleVisible = (e) => {
  menuVisible.value = e;
  rowValue.value = {};
};

const onClick = (record) => {
  bind.visible = true
  bind.data = record
}

const onRefresh = (val) => {
  bind.visible = false
  if (val) {
    tableRef.value.reload()
  }
}

const onRemove = (record) => {
  dataObj.value[record.id] = {}
}

const onUnbind = async (record) => {
  const resp = await unbind(record.id)
  if (resp.success) {
    onlyMessage($t('CardManagement.index.427944-57'))
    tableRef.value.reload()
  }
}

const onDrop = (e, record) => {
  activeOverIndex.value = -1
  const jsonData = e.dataTransfer.getData('application/json');
  dataObj.value[record.id] = JSON.parse(jsonData)
}

const handleClick = (dt) => {
  menuStore.jumpPage('iot-card/CardManagement/Detail', {
    params: {id: dt.id}
  })
}

const handleMenuClick = (e) => {
  menuVisible.value = false
  switch (e.key) {
    case 'reopen':
      Modal.confirm({
        title: $t('CardManagement.index.427944-60'),
        async onOk() {
          const resp = await resumption(rowValue.value.id)
          if (resp && resp.success) {
            onlyMessage($t('CardManagement.index.427944-57'))
            tableRef.value.reload()
          }
        },
      });
      break;
    case 'stop':
      Modal.confirm({
        title: $t('CardManagement.index.427944-61'),
        async onOk() {
          const resp = await unDeploy(rowValue.value.id)
          if (resp && resp.success) {
            onlyMessage($t('CardManagement.index.427944-57'))
            tableRef.value.reload()
          }
        },
      });
      break;
    case 'unbind':
      Modal.confirm({
        title: $t('CardManagement.index.427944-54'),
        async onOk() {
          await onUnbind(rowValue.value)
        },
      });
      break;
    case 'bind':
      onClick(rowValue.value)
      break;
    case 'delete':
      Modal.confirm({
        title: $t('CardManagement.index.427944-63'),
        async onOk() {
          const resp = await del(rowValue.value.id)
          if (resp && resp.success) {
            onlyMessage($t('CardManagement.index.427944-57'))
            tableRef.value.reload()
          }
        },
      });
      break;
    case 'batch-stop':
      Modal.confirm({
        title: $t('TrafficPoolManagement.Detail.index.390590-30'),
        async onOk() {
          const response = await unDeployBatch(_selectedRowKeys.value)
          if (response.success) {
            onlyMessage($t('CardManagement.index.427944-57'))
            _selectedRowKeys.value = []
            tableRef.value.reload()
          }
        },
      });
      break;
    case 'batch-reopen':
      Modal.confirm({
        title: $t('TrafficPoolManagement.Detail.index.390590-31'),
        async onOk() {
          const response = await resumptionBatch(_selectedRowKeys.value)
          if (response.success) {
            onlyMessage($t('CardManagement.index.427944-57'))
            _selectedRowKeys.value = []
            tableRef.value.reload()
          }
        },
      });
      break;
    case 'batch-unbind':
      // handleBatchDevice()
      break;
    case 'batch-delete':
      Modal.confirm({
        title: $t('CardManagement.index.427944-63'),
        async onOk() {
          const response = await removeCards(_selectedRowKeys.value.map((v) => ({id: v})))
          if (response.success) {
            onlyMessage($t('CardManagement.index.427944-57'))
            _selectedRowKeys.value = []
            tableRef.value.reload()
          }
        },
      });
      break;
  }
};

const dragover = (e, index) => {
  e.preventDefault(); // 必须阻止默认行为
  activeOverIndex.value = index
}

const dragleave = () => {
  activeOverIndex.value = -1
}

const onLeaveChange = async (next) => {
  const arr = Object.keys(dataObj.value).filter(_key => !!dataObj.value[_key]?.deviceId).map(key => {
    return {
      "cardId": key,
      "deviceId": dataObj.value[key].deviceId
    }
  })
  if (batchVisible.value && arr.length) {
    Modal.confirm({
      title: $t('Save.index.766438-2'),
      okText: $t('Save.index.766438-0'),
      cancelText: $t('Save.index.766438-4'),
      onOk: async () => {
        await onSaveBindDevice(arr, next);
      },
      onCancel: async () => {
        next()
      }
    })
  } else {
    next()
  }
}
//
const debouncedBeforeRouteLeave = debounce(onLeaveChange, 300);

onBeforeRouteUpdate((to, from, next) => {
  debouncedBeforeRouteLeave(next);
})

defineExpose({
  onLeaveChange
})
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

.bind-device {
  background-color: #F0F0F0;
  padding: 6px;
  border-radius: 6px;

  &.bind {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 12px;

    .bind-left {
      flex: 1;
      min-width: 0;
      display: flex;
      align-items: center;
    }
  }

  &.unbind {
    text-align: center;
    color: #777777;
    cursor: pointer;
  }

  &.active {
    background-color: #498BEF;
  }
}
</style>
