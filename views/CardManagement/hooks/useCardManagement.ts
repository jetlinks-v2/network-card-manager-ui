import { computed, onMounted, ref } from 'vue'
import { useListStatus } from '../../components/list/useListStatus'
import { normalizeCardTerms, readCount } from '../../components/list/query'
import type { ListQuery, ListTableRef, RowAction } from '../../components/list/types'
import { getCardSearchColumns } from './cardColumns'

import {
  queryCount,
  changeDeploy,
  unDeploy,
  resumption,
  del,
  changeDeployBatch,
  unDeployBatch,
  resumptionBatch,
  removeCards,
  unbind, queryDetailList
} from '../../../api/cardManagement'
import type {CardManagement} from '../typing'
import {onlyMessage} from '@jetlinks-web/utils'

import {BatchActionsType} from '@jetlinks-web-core/components/BatchDropdown/types'
import {useMenuStore, useAuthStore} from '@jetlinks-web-core/store'

import {useI18n} from 'vue-i18n';
import {useRouterParams} from '@jetlinks-web/hooks';

export function useCardManagement() {
  const {t: $t} = useI18n();

  const menuStory = useMenuStore()
  const cardManageRef = ref<ListTableRef>()
  const { params, status, statusOptions, listError, requestList, changeStatus, handleSearch } = useListStatus({
    request: queryDetailList,
    column: 'syncCardStatus', options: [
      { value: 'success', label: 'CardManagement.index.427944-50' },
      { value: 'failed', label: 'CardManagement.index.427944-19' },
    ], t: $t,
    count: async query => {
      const response = await queryCount(query)
      if (!response.success) throw new Error('Card count failed')
      return readCount(response.result)
    },
  })
  const searchColumns = computed(() => getCardSearchColumns($t))
  const syncStatusColor: Record<string, string | undefined> = {
    success: 'success', failed: 'error', waiting: 'warning', running: 'processing', notSync: undefined,
  }
  const columns = computed(() => {
    const visible = ['id', 'iccId', 'platformConfigName', 'comboType', 'deviceId', 'syncCardStatus']
    const widths: Record<string, number> = { id: 220, iccId: 200, platformConfigName: 160, comboType: 130, deviceId: 240, syncCardStatus: 140 }
    return [
      ...visible.map(key => {
        const column = searchColumns.value.find(item => item.dataIndex === key)!
        return { ...column, scopedSlots: true, width: widths[key],
          ...(key === 'id' ? { title: $t('SimList.name') } : {}) }
      }),
      { title: $t('SimList.flowUsage'), dataIndex: 'flowUsage', key: 'flowUsage', width: 300, scopedSlots: true },
      { title: $t('CardManagement.index.427944-51'), key: 'action', fixed: 'right', width: 100, scopedSlots: true },
    ]
  })

  const _selectedRowKeys = ref<string[]>([])
  const bindDeviceVisible = ref<boolean>(false)
  const visible = ref<boolean>(false)
  const exportVisible = ref<boolean>(false)
  const importVisible = ref<boolean>(false)
  const cardId = ref('')
  const current = ref<Partial<CardManagement>>({})
  const saveType = ref<string>('')
  const isCheck = ref<boolean>(false)
  const syncVisible = ref(false)
  const routerParams = useRouterParams();

  const btnHasPermission = useAuthStore().hasPermission
  const paltformPermission = btnHasPermission(`iot-card/Platform:add`)
  const importSave = () => {
    cardManageRef.value?.reload()
    importVisible.value = false
  }

  const getActions = (
      data: CardManagement
  ): RowAction[] => {
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
              response.then((resp: { status: number }) => {
                if (resp.status === 200) {
                  onlyMessage($t('CardManagement.index.427944-57'))
                  cardManageRef.value?.reload()
                }
              })
            } else if (data.cardStateType?.value === 'deactivate') {
              response = resumption(data.id)
              response.then((resp: { status: number }) => {
                if (resp.status === 200) {
                  onlyMessage($t('CardManagement.index.427944-57'))
                  cardManageRef.value?.reload()
                }
              })
            } else {
              response = unDeploy(data.id)
              response.then((resp: { status: number }) => {
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
              params: {id: data.id}
            })
          }
        },
        ...arr
      ]
  }

  const search = (query: ListQuery) => handleSearch({ ...query, terms: normalizeCardTerms(query.terms) })

  const onSelectChange = (item: any, state: boolean) => {
    const arr = new Set(_selectedRowKeys.value);
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

  const openDetail = (row: { id: string }) => {
    menuStory.jumpPage('iot-card/CardManagement/Detail', { params: { id: row.id } })
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

  }

  /**
   * 批量删除
   */
  const handelRemove = () => {
    if (!_selectedRowKeys.value.length) {
      onlyMessage($t('CardManagement.index.427944-66'), 'error')
      return
    }
    const response = removeCards(_selectedRowKeys.value.map((v) => ({id: v})))
    response.then((resp: { status: number }) => {
      if (resp.status === 200) {
        onlyMessage($t('CardManagement.index.427944-57'))
        _selectedRowKeys.value = []
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

  return { cardManageRef, params, columns, searchColumns, requestList, search, status, statusOptions, changeStatus, listError, syncStatusColor,
    _selectedRowKeys, isCheck, onSelectChange, selectAll, onCheckChange, batchActions, getActions, openDetail, handleAdd,
    importVisible, exportVisible, bindDeviceVisible, visible, syncVisible, cardId, current, saveType,
    importSave, bindDevice, saveChange, syncClose }
}
