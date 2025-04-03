<!-- 物联卡管理 -->
<template>
  <j-page-container>
    <pro-search
      :columns="columns"
      target="iot-card-management-search"
      @search="handleSearch"
    />
    <FullPage>
      <j-pro-table
        :scroll="{ x: '2500px' }"
        ref="cardManageRef"
        :columns="columns"
        :request="query"
        :defaultParams="{
          sorts: [{ name: 'createTime', order: 'desc' }]
        }"
        :rowSelection="
          isCheck
            ? {
                selectedRowKeys: _selectedRowKeys,
                onSelect: onSelectChange,
                onSelectAll: selectAll,
                onSelectNone: () => (_selectedRowKeys = []),
              }
            : false
        "
        :params="params"
        modeValue="CARD"
        :gridColumns="[2]"
      >
        <template #headerLeftRender>
          <a-space>
            <j-permission-button
              @click="handleAdd"
              :hasPermission="'iot-card/CardManagement:add'"
              type="primary"
            >
              <AIcon type="PlusOutlined" />{{ $t('CardManagement.index.427944-0') }}
            </j-permission-button>
            <BatchDropdown
              v-model:isCheck="isCheck"
              :actions="batchActions"
              @change="onCheckChange"
            />
          </a-space>
        </template>
        <template #card="slotProps">
          <CardBox
            :value="slotProps"
            @click="handleClick"
            :actions="getActions(slotProps, 'card')"
            v-bind="slotProps"
            :active="_selectedRowKeys.includes(slotProps.id)"
            :status="slotProps.cardStateType?.value"
            :statusText="slotProps.cardStateType?.text"
            :statusNames="{
              using: 'processing',
              toBeActivated: 'default',
              deactivate: 'error'
            }"
          >
            <template #img>
              <slot name="img">
                <img :src="iotCard.iotCardBg" />
              </slot>
            </template>
            <template #content>
              <span style="font-size: 16px; font-weight: 600">
                <j-ellipsis style="width: calc(100% - 100px)">
                  {{ slotProps.id }}
                </j-ellipsis>
              </span>
              <a-row style="margin-top: 20px">
                <a-col :span="6">
                  <div class="card-item-content-text">{{ $t('CardManagement.index.427944-1') }}</div>
                  <j-ellipsis style="width: calc(100% - 20px)">
                    {{ slotProps.platformConfigName }}
                  </j-ellipsis>
                </a-col>
                <a-col :span="6">
                  <div class="card-item-content-text">{{ $t('CardManagement.index.427944-2') }}</div>
                  <j-badge-status
                    v-if="slotProps.cardState?.state"
                    :status="slotProps.cardState?.state"
                    :text="slotProps.cardState?.text"
                    :statusNames="{
                      using: 'processing',
                      toBeActivated: 'default',
                      deactivate: 'error'
                    }"
                  />
                  <span v-else>--</span>
                </a-col>
                <a-col :span="6">
                  <div class="card-item-content-text">{{ $t('CardManagement.index.427944-3') }}</div>
                  <div>{{ slotProps?.cardType?.text || '--' }}</div>
                </a-col>
                <a-col :span="6">
                  <div class="card-item-content-text">{{ $t('CardManagement.index.427944-4') }}</div>
                  <j-ellipsis>{{ slotProps.deviceName || '--' }}</j-ellipsis>
                </a-col>
              </a-row>
              <a-divider style="margin: 12px 0" />
              <div class="content-bottom">
                <div>
                  <div class="progress-text">
                    <div>
                      {{
                        slotProps.totalFlow
                          ? (
                              (slotProps.usedFlow / slotProps.totalFlow) *
                              100
                            ).toFixed(2)
                          : '0.00'
                      }}
                      %
                    </div>
                    <div class="card-item-content-text">
                      {{ $t('CardManagement.index.427944-5') }} {{ slotProps.totalFlow }} M
                    </div>
                  </div>
                  <a-progress
                    :strokeColor="'#ADC6FF'"
                    :showInfo="false"
                    :percent="
                      slotProps.totalFlow
                        ? (slotProps.usedFlow / slotProps.totalFlow) * 100
                        : 0
                    "
                  />
                </div>
              </div>
            </template>
            <template #actions="item">
              <j-permission-button
                :disabled="item.disabled"
                :popConfirm="item.popConfirm"
                :tooltip="{
                  ...item.tooltip
                }"
                @click="item.onClick"
                :hasPermission="'iot-card/CardManagement:' + item.key"
              >
                <AIcon type="DeleteOutlined" v-if="item.key === 'delete'" />
                <template v-else>
                  <AIcon :type="item.icon" />
                  <span>{{ item?.text }}</span>
                </template>
              </j-permission-button>
            </template>
          </CardBox>
        </template>
        <template #deviceId="slotProps">
          {{ slotProps.deviceName || '--' }}
        </template>
        <template #totalFlow="slotProps">
          <div>
            {{
              slotProps.totalFlow ? slotProps.totalFlow.toFixed(2) + ' M' : '--'
            }}
          </div>
        </template>
        <template #usedFlow="slotProps">
          <div>
            {{ slotProps.usedFlow ? slotProps.usedFlow.toFixed(2) + ' M' : '--' }}
          </div>
        </template>
        <template #residualFlow="slotProps">
          <div>
            {{
              slotProps.residualFlow
                ? slotProps.residualFlow.toFixed(2) + ' M'
                : '--'
            }}
          </div>
        </template>
        <template #operatorName="slotProps">
          {{ OperatorMap[slotProps.operatorName] }}
        </template>
        <template #cardType="slotProps">
          {{ slotProps?.cardType?.text || '--' }}
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
        <template #syncCardStatus="slotProps">
          <span>{{slotProps.syncCardStatus?.text || '--'}}</span>
        </template>
        <template #cardState="slotProps">
          <j-badge-status
            v-if="slotProps.cardState?.state"
            :status="slotProps.cardState?.state"
            :text="slotProps.cardState?.text"
            :statusNames="{
              using: 'processing',
              toBeActivated: 'default',
              deactivate: 'error'
            }"
          />
          <span v-else>--</span>
        </template>
        <template #activationDate="slotProps">
          {{
            slotProps.activationDate
              ? dayjs(slotProps.activationDate).format('YYYY-MM-DD HH:mm:ss')
              : '--'
          }}
        </template>
        <template #updateTime="slotProps">
          {{
            slotProps.updateTime
              ? dayjs(slotProps.updateTime).format('YYYY-MM-DD HH:mm:ss')
              : ''
          }}
        </template>
        <template #action="slotProps">
          <a-space>
            <template v-for="i in getActions(slotProps, 'table')" :key="i.key">
              <j-permission-button
                :disabled="i.disabled"
                :popConfirm="i.popConfirm"
                :tooltip="{
                  ...i.tooltip
                }"
                @click="i.onClick"
                type="link"
                style="padding: 0px"
                :hasPermission="
                  i.key === 'view' ? true : 'iot-card/CardManagement:' + i.key
                "
                :danger="i.key === 'delete'"
              >
                <template #icon>
                  <AIcon :type="i.icon" />
                </template>
              </j-permission-button>
            </template>
          </a-space>
        </template>
      </j-pro-table>
    </FullPage>
    <!-- {{ $t('CardManagement.index.427944-69') }} -->
    <Import
      v-if="importVisible"
      @close="importVisible = false"
      @save="importSave"
    />
    <!-- {{ $t('CardManagement.index.427944-68') }} -->
    <Export
      v-if="exportVisible"
      @close="exportVisible = false"
      :data="_selectedRowKeys"
    />
    <!-- {{ $t('CardManagement.index.427944-4') }} -->
    <BindDevice
      v-if="bindDeviceVisible"
      :cardId="cardId"
      @change="bindDevice"
      +
    />
    <!-- {{ $t('CardManagement.index.427944-0') }}、{{ $t('CardManagement.index.427944-52') }} -->
    <Save
      v-if="visible"
      :type="saveType"
      :data="current"
      @change="saveChange"
    />
    <!--   批量同步     -->
    <SyncModal v-if="syncVisible" :params="params" @close="syncClose" />
  </j-page-container>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import {
  query,
  queryPlatformNoPage,
  changeDeploy,
  unDeploy,
  resumption,
  del,
  changeDeployBatch,
  unDeployBatch,
  resumptionBatch,
  sync,
  removeCards,
  unbind
} from '../../api/cardManagement'
import type { CardManagement } from './typing'
import { onlyMessage } from '@jetlinks-web/utils'
import BindDevice from './BindDevice.vue'
import Import from './Import.vue'
import Export from './Export.vue'
import Save from './Save.vue'
import { BatchActionsType } from '@/components/BatchDropdown/types'
import { useMenuStore, useAuthStore } from '@/store'
import SyncModal from './Sync.vue'
import { OperatorList, OperatorMap } from '../data'
import { iotCard } from '../../assets'
import { useI18n } from 'vue-i18n';
import { useRouterParams } from '@jetlinks-web/hooks';

const { t: $t } = useI18n();
const router = useRouter()
const menuStory = useMenuStore()
const cardManageRef = ref<Record<string, any>>({})
const params = ref<Record<string, any>>({})
const _selectedRowKeys = ref<string[]>([])
// const _selectedRow = ref<any[]>([]);
const bindDeviceVisible = ref<boolean>(false)
const visible = ref<boolean>(false)
const exportVisible = ref<boolean>(false)
const importVisible = ref<boolean>(false)
const cardId = ref<any>()
const current = ref<Partial<CardManagement>>({})
const saveType = ref<string>('')
const isCheck = ref<boolean>(false)
const syncVisible = ref(false)
const routerParams = useRouterParams();

const columns = [
  {
    title: $t('CardManagement.index.427944-6'),
    dataIndex: 'id',
    key: 'id',
    width: 200,
    ellipsis: true,
    fixed: 'left',
    search: {
      type: 'string'
    }
  },
  {
    title: 'ICCID',
    dataIndex: 'iccId',
    key: 'iccId',
    ellipsis: true,
    width: 200,
    search: {
      type: 'string'
    }
  },
  {
    title: $t('CardManagement.index.427944-4'),
    dataIndex: 'deviceId',
    key: 'deviceId',
    ellipsis: true,
    scopedSlots: true,
    width: 200,
    search: {
      type: 'string',
      rename: 'deviceName'
    }
  },
  {
    title: $t('CardManagement.index.427944-1'),
    dataIndex: 'platformConfigName',
    key: 'platformConfigName',
    width: 200,
    ellipsis: true,
    search: {
      rename: 'platformConfigId',
      type: 'select',
      options: async () => {
        return new Promise((resolve) => {
          queryPlatformNoPage({
            sorts: [{ name: 'createTime', order: 'desc' }],
          }).then((resp: any) => {
            const list = resp.result.map((item: any) => ({
              label: item.name,
              value: item.id
            }))
            resolve(list)
          })
        })
      }
    }
  },
  {
    title: $t('CardManagement.index.427944-7'),
    dataIndex: 'operatorName',
    key: 'operatorName',
    width: 120,
    search: {
      type: 'select',
      options: async () => {
        return OperatorList
      }
    }
  },
  {
    title: $t('CardManagement.index.427944-3'),
    dataIndex: 'cardType',
    key: 'cardType',
    scopedSlots: true,
    width: 120,
    search: {
      type: 'select',
      options: [
        { label: $t('CardManagement.index.427944-8'), value: 'year' },
        { label: $t('CardManagement.index.427944-9'), value: 'season' },
        { label: $t('CardManagement.index.427944-10'), value: 'month' },
        { label: $t('CardManagement.index.427944-11'), value: 'other' }
      ]
    }
  },
  {
    title: $t('CardManagement.index.427944-12'),
    key: 'totalFlow',
    dataIndex: 'totalFlow',
    width: 120,
    scopedSlots: true
  },
  {
    title: $t('CardManagement.index.427944-13'),
    dataIndex: 'usedFlow',
    width: 120,
    scopedSlots: true
  },
  {
    title: $t('CardManagement.index.427944-14'),
    dataIndex: 'residualFlow',
    width: 120,
    ellipsis: true,
    scopedSlots: true
  },
  {
    title: $t('CardManagement.index.427944-15'),
    dataIndex: 'activationDate',
    key: 'activationDate',
    scopedSlots: true,
    width: 200,
    search: {
      type: 'date'
    }
  },
  {
    title: $t('CardManagement.index.427944-16'),
    dataIndex: 'updateTime',
    key: 'updateTime',
    scopedSlots: true,
    width: 200,
    ellipsis: true,
    search: {
      type: 'date'
    }
  },
  {
    title: $t('CardManagement.index.427944-17'),
    dataIndex: 'cardStateType',
    key: 'cardStateType',
    width: 180,
    ellipsis: true,
    scopedSlots: true,
    search: {
      type: 'select',
      options: [
        { label: $t('CardManagement.index.427944-18'), value: 'notReady' },
        { label: $t('CardManagement.index.427944-19'), value: 'error' },
        { label: $t('CardManagement.index.427944-20'), value: 'using' },
        { label: $t('CardManagement.index.427944-21'), value: 'toBeActivated' },
        { label: $t('CardManagement.index.427944-22'), value: 'deactivate' },
        { label: $t('CardManagement.index.427944-23'), value: 'other' }
      ]
    }
  },
  {
    title: $t('CardManagement.index.427944-2'),
    dataIndex: 'cardState',
    key: 'cardState',
    width: 180,
    ellipsis: true,
    scopedSlots: true
  },
  {
    title: $t('CardManagement.index.427944-2'),
    dataIndex: 'operatorState',
    key: 'operatorState',
    // hidden: true,
    hideInTable: true,
    search: {
      type: 'select',
      options: [
        { label: $t('CardManagement.index.427944-76'), value: 'using' },
        { label: $t('CardManagement.index.427944-25'), value: 'testActivation' },
        { label: $t('CardManagement.index.427944-26'), value: 'disassemble' },
        { label: $t('CardManagement.index.427944-77'), value: 'deactivate' },
        { label: $t('CardManagement.index.427944-29'), value: 'operatorManagement' },
        { label: $t('CardManagement.index.427944-78'), value: 'beActivated' },
        { label: $t('CardManagement.index.427944-21'), value: 'toBeActivated' },
        { label: $t('CardManagement.index.427944-32'), value: 'testToActivation' },
        { label: $t('CardManagement.index.427944-33'), value: 'testable' },
        { label: $t('CardManagement.index.427944-79'), value: 'inStock' },
        { label: $t('CardManagement.index.427944-36'), value: 'preSeller' },
        { label: $t('CardManagement.index.427944-37'), value: 'oneWayShutdown' },
        { label: $t('CardManagement.index.427944-38'), value: 'preSale' },
        { label: $t('CardManagement.index.427944-39'), value: 'transfer' },
        { label: $t('CardManagement.index.427944-40'), value: 'dormant' },
        { label: $t('CardManagement.index.427944-80'), value: 'activatable' },
        { label: $t('CardManagement.index.427944-42'), value: 'expired' },
        { label: $t('CardManagement.index.427944-43'), value: 'cleared' },
        { label: $t('CardManagement.index.427944-44'), value: 'replaced' },
        { label: $t('CardManagement.index.427944-45'), value: 'stock' },
        { label: $t('CardManagement.index.427944-46'), value: 'start' }
      ]
    }
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
    title: $t('CardManagement.index.427944-51'),
    key: 'action',
    fixed: 'right',
    width: 220,
    scopedSlots: true
  }
]
const btnHasPermission = useAuthStore().hasPermission
const paltformPermission = btnHasPermission(`iot-card/Platform:add`)
const importSave = () => {
  cardManageRef.value?.reload()
  importVisible.value = false
}

const getActions = (
  data: Partial<Record<string, any>>,
  type: 'card' | 'table'
): any[] => {
  if (!data) return []
  const arr = [
    {
      key: 'update',
      text: $t('CardManagement.index.427944-52'),
      tooltip: {
        title: $t('CardManagement.index.427944-52')
      },
      icon: 'EditOutlined',
      onClick: () => {
        visible.value = true
        current.value = data
        saveType.value = 'edit'
      }
    },
    {
      key: 'bind',
      text: data.deviceId ? $t('CardManagement.index.427944-53') : $t('CardManagement.index.427944-4'),
      tooltip: {
        title: data.deviceId ? $t('CardManagement.index.427944-53') : $t('CardManagement.index.427944-4')
      },
      icon: data.deviceId ? 'DisconnectOutlined' : 'LinkOutlined',
      popConfirm: data.deviceId
        ? {
            title: $t('CardManagement.index.427944-54'),
            okText: $t('CardManagement.index.427944-55'),
            cancelText: $t('CardManagement.index.427944-56'),
            onConfirm: () => {
              const response = unbind(data.id)
              response.then((resp: any) => {
                if (resp.status === 200) {
                  onlyMessage($t('CardManagement.index.427944-57'))
                  cardManageRef.value?.reload()
                }
              })
              return response
            }
          }
        : undefined,
      onClick: () => {
        if (!data.deviceId) {
          bindDeviceVisible.value = true
          cardId.value = data.id
        }
      }
    },
    {
      key: data.cardStateType?.value === 'toBeActivated' ? 'active' : 'action',
      text:
        data.cardStateType?.value === 'toBeActivated'
          ? $t('CardManagement.index.427944-20')
          : data.cardStateType?.value === 'deactivate'
          ? $t('CardManagement.index.427944-58')
          : $t('CardManagement.index.427944-27'),
      tooltip: {
        title:
          data.cardStateType?.value === 'toBeActivated'
            ? $t('CardManagement.index.427944-20')
            : data.cardStateType?.value === 'deactivate'
            ? $t('CardManagement.index.427944-58')
            : $t('CardManagement.index.427944-27')
      },
      icon:
        data.cardStateType?.value === 'toBeActivated'
          ? 'CheckCircleOutlined'
          : data.cardStateType?.value === 'deactivate'
          ? 'PoweroffOutlined'
          : 'StopOutlined',
      popConfirm: {
        title:
          data.cardStateType?.value === 'toBeActivated'
            ? $t('CardManagement.index.427944-59')
            : data.cardStateType?.value === 'deactivate'
            ? $t('CardManagement.index.427944-60')
            : $t('CardManagement.index.427944-61'),
        okText: $t('CardManagement.index.427944-55'),
        cancelText: $t('CardManagement.index.427944-56'),
        onConfirm: () => {
          let response
          if (data.cardStateType?.value === 'toBeActivated') {
            response = changeDeploy(data.id)
            response.then((resp) => {
              if (resp.status === 200) {
                onlyMessage($t('CardManagement.index.427944-57'))
                cardManageRef.value?.reload()
              }
            })
          } else if (data.cardStateType?.value === 'deactivate') {
            response = resumption(data.id)
            response.then((resp) => {
              if (resp.status === 200) {
                onlyMessage($t('CardManagement.index.427944-57'))
                cardManageRef.value?.reload()
              }
            })
          } else {
            response = unDeploy(data.id)
            response.then((resp) => {
              if (resp.status === 200) {
                onlyMessage($t('CardManagement.index.427944-57'))
                cardManageRef.value?.reload()
              }
            })
          }
          return response
        }
      }
    },
    {
      key: 'delete',
      text: $t('CardManagement.index.427944-62'),
      tooltip: {
        title: $t('CardManagement.index.427944-62')
      },
      popConfirm: {
        title: $t('CardManagement.index.427944-63'),
        okText: $t('CardManagement.index.427944-55'),
        cancelText: $t('CardManagement.index.427944-56'),
        onConfirm: () => {
          const response: any = del(data.id)
          response.then((resp: any) => {
            if (resp.status === 200) {
              onlyMessage($t('CardManagement.index.427944-57'))
              const index = _selectedRowKeys.value.findIndex(
                (id: any) => id === data.id
              )
              if (index !== -1) {
                _selectedRowKeys.value.splice(index, 1)
              }
              cardManageRef.value?.reload()
            } else {
              onlyMessage($t('CardManagement.index.427944-64'), 'error')
            }
          })
          return response
        }
      },
      icon: 'DeleteOutlined'
    }
  ]
  if (type === 'card') {
    return arr
  } else {
    return [
      {
        key: 'view',
        text: $t('CardManagement.index.427944-65'),
        tooltip: {
          title: $t('CardManagement.index.427944-65')
        },
        icon: 'EyeOutlined',
        onClick: () => {
          menuStory.jumpPage('iot-card/CardManagement/Detail', {
            params: { id: data.id }
          })
        }
      },
      ...arr
    ]
  }
}

const handleSearch = (e: any) => {
  params.value = { terms: e?.terms || [] }
}

const onSelectChange = (item: any, state: boolean) => {
  const arr = new Set(_selectedRowKeys.value);
    // console.log(item, state);
    if (state) {
        arr.add(item.id);
    } else {
        arr.delete(item.id);
    }
    _selectedRowKeys.value = [...arr.values()];
}

const selectAll = (selected: Boolean, selectedRows: any, changeRows: any) => {
    if (selected) {
        changeRows.map((i: any) => {
            if (!_selectedRowKeys.value.includes(i.id)) {
                _selectedRowKeys.value.push(i.id);
            }
        });
    } else {
        const arr = changeRows.map((item: any) => item.id);
        const _ids: string[] = [];
        _selectedRowKeys.value.map((i: any) => {
            if (!arr.includes(i)) {
                _ids.push(i);
            }
        });
        _selectedRowKeys.value = _ids;
    }
};

const cancelSelect = () => {
  _selectedRowKeys.value = []
}

const handleClick = (dt: any) => {
  if (!dt?.cardStateType) {
    return
  }
  if (isCheck.value) {
    if (_selectedRowKeys.value.includes(dt.id)) {
      const _index = _selectedRowKeys.value.findIndex((i) => i === dt.id)
      _selectedRowKeys.value.splice(_index, 1)
    } else {
      _selectedRowKeys.value = [..._selectedRowKeys.value, dt.id]
    }
  } else {
    menuStory.jumpPage('iot-card/CardManagement/Detail', {
      params: { id: dt.id }
    })
  }
}

const onCheckChange = () => {
  _selectedRowKeys.value = []
}

/**
 * 新增
 */
const handleAdd = () => {
  visible.value = true
  current.value = {}
  saveType.value = 'add'
}

/**
 * 新增、编辑关闭弹窗
 * @param val 加载表格
 */
const saveChange = (val: any) => {
  visible.value = false
  current.value = {}
  if (val) {
    cardManageRef.value?.reload()
  }
}

/**
 * 绑定设备关闭窗口
 * @param val
 */
const bindDevice = (val: boolean) => {
  bindDeviceVisible.value = false
  cardId.value = ''
  if (val) {
    cardManageRef.value?.reload()
  }
}

/**
 * 批量激活
 */
const handleActive = () => {
  if (!_selectedRowKeys.value.length) {
    return onlyMessage($t('CardManagement.index.427944-66'), 'warning')
  }
  if (
    _selectedRowKeys.value.length >= 10 &&
    _selectedRowKeys.value.length <= 100
  ) {
    changeDeployBatch(_selectedRowKeys.value).then((res: any) => {
      if (res.status === 200) {
        onlyMessage($t('CardManagement.index.427944-57'))
      }
    })
  } else {
    onlyMessage($t('CardManagement.index.427944-67'), 'warning')
  }
}

/**
 * 批量停用
 */
const handleStop = () => {
  if (
    _selectedRowKeys.value.length >= 10 &&
    _selectedRowKeys.value.length <= 100
  ) {
    const response = unDeployBatch(_selectedRowKeys.value)
    response.then((res: any) => {
      if (res.status === 200) {
        onlyMessage($t('CardManagement.index.427944-57'))
      }
    })
    return response
  } else {
    onlyMessage($t('CardManagement.index.427944-67'), 'warning')
  }
}

/**
 * 批量复机
 */
const handleResumption = () => {
  if (
    _selectedRowKeys.value.length >= 10 &&
    _selectedRowKeys.value.length <= 100
  ) {
    const response = resumptionBatch(_selectedRowKeys.value)
    response.then((res: any) => {
      if (res.status === 200) {
        onlyMessage($t('CardManagement.index.427944-57'))
      }
    })
    return response
  } else {
    onlyMessage($t('CardManagement.index.427944-67'), 'warning')
  }
}

/**
 * 同步状态
 */
const handleSync = async () => {
  syncVisible.value = true
  // if (!_selectedRowKeys.value.length) {
  //     onlyMessage($t('CardManagement.index.427944-66'), 'error');
  //     return;
  // }

  // const api = `${BASE_API_PATH}/network/card/state/_sync`
  // const _source = new EventSourcePolyfill(api)
  //
  // _source.onmessage = (e: any) => {
  //   console.log(e)
  // }
  //
  // const resp = await sync(
  //     _selectedRowKeys.value.map((v) => ({ id: v })),
  // );
  //
  //     if (resp.status === 200) {
  //         _selectedRowKeys.value = [];
  //         cardManageRef.value?.reload();
  //         onlyMessage('同步状态成功');
  //     }
}

/**
 * 批量删除
 */
const handelRemove = () => {
  if (!_selectedRowKeys.value.length) {
    onlyMessage($t('CardManagement.index.427944-66'), 'error')
    return
  }
  const response = removeCards(_selectedRowKeys.value.map((v) => ({ id: v })))
  response.then((resp) => {
    if (resp.status === 200) {
      onlyMessage($t('CardManagement.index.427944-57'))
      _selectedRowKeys.value = []
      // _selectedRow.value = [];
      cardManageRef.value?.reload()
    }
  })
  return response
}
const batchActions: BatchActionsType[] = [
  {
    key: 'export',
    text: $t('CardManagement.index.427944-68'),
    permission: 'iot-card/CardManagement:export',
    icon: 'ExportOutlined',
    onClick: () => {
      exportVisible.value = true
    }
  },
  {
    key: 'import',
    text: $t('CardManagement.index.427944-69'),
    permission: 'iot-card/CardManagement:import',
    icon: 'ImportOutlined',
    onClick: () => {
      importVisible.value = true
    }
  },
  {
    key: 'stop',
    text: $t('CardManagement.index.427944-70'),
    permission: 'iot-card/CardManagement:action',
    icon: 'StopOutlined',
    selected: {
      popConfirm: {
        title: $t('CardManagement.index.427944-71'),
        onConfirm: handleStop
      }
    }
  },
  {
    key: 'resumption',
    text: $t('CardManagement.index.427944-72'),
    ghost: true,
    type: 'primary',
    permission: 'iot-card/CardManagement:action',
    icon: 'PoweroffOutlined',
    selected: {
      popConfirm: {
        title: $t('CardManagement.index.427944-73'),
        onConfirm: handleResumption
      }
    }
  },
  {
    key: 'sync',
    text: $t('CardManagement.index.427944-47'),
    ghost: true,
    type: 'primary',
    permission: 'iot-card/CardManagement:sync',
    icon: 'SwapOutlined',
    onClick: handleSync
  },
  {
    key: 'delete',
    text: $t('CardManagement.index.427944-74'),
    danger: true,
    permission: 'iot-card/CardManagement:delete',
    icon: 'StopOutlined',
    selected: {
      popConfirm: {
        title: $t('CardManagement.index.427944-75'),
        onConfirm: handelRemove
      }
    }
  }
]

const syncClose = () => {
  syncVisible.value = false
  cardManageRef.value?.reload()
}

onMounted(() => {
  if (routerParams.params.value.type === 'add' && paltformPermission) {
    handleAdd()
  }
})
</script>

<style scoped lang="less">
.content-bottom {
  height: 38px;
}
.flow-text {
  font-size: 20px;
  font-weight: 600;
}

.progress-text {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.ant-progress-inner) {
  border-radius: 0px;
}

:deep(.ant-progress-bg) {
  border-radius: 0px;
}
</style>
