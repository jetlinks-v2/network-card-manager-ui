import { queryPlatformNoPage } from '../../../api/cardManagement'
import { OperatorList } from '../../data'
import type { Translate } from '../../components/list/types'

export function getCardSearchColumns($t: Translate) {
  return [
    { title: $t('SimList.name'), dataIndex: 'name', key: 'name', hideInTable: true, search: { type: 'string' } },
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
              sorts: [{name: 'createTime', order: 'desc'}],
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
      scopedSlots: true,
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
      dataIndex: 'comboType',
      key: 'comboType',
      scopedSlots: true,
      width: 120,
      search: {
        type: 'select',
        options: [
          {label: $t('Dashboard.index.537937-19'), value: 'pool'},
          {label: $t('Dashboard.index.537937-18'), value: 'single'},
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
      width: 100,
      search: {
        type: 'select',
        options: [
          {label: $t('CardManagement.index.427944-76'), value: 'using'},
          {label: $t('CardManagement.index.427944-25'), value: 'testActivation'},
          {label: $t('CardManagement.index.427944-26'), value: 'disassemble'},
          {label: $t('CardManagement.index.427944-77'), value: 'deactivate'},
          {label: $t('CardManagement.index.427944-29'), value: 'operatorManagement'},
          {label: $t('CardManagement.index.427944-78'), value: 'beActivated'},
          {label: $t('CardManagement.index.427944-21'), value: 'toBeActivated'},
          {label: $t('CardManagement.index.427944-32'), value: 'testToActivation'},
          {label: $t('CardManagement.index.427944-33'), value: 'testable'},
          {label: $t('CardManagement.index.427944-79'), value: 'inStock'},
          {label: $t('CardManagement.index.427944-36'), value: 'preSeller'},
          {label: $t('CardManagement.index.427944-37'), value: 'oneWayShutdown'},
          {label: $t('CardManagement.index.427944-38'), value: 'preSale'},
          {label: $t('CardManagement.index.427944-39'), value: 'transfer'},
          {label: $t('CardManagement.index.427944-40'), value: 'dormant'},
          {label: $t('CardManagement.index.427944-80'), value: 'activatable'},
          {label: $t('CardManagement.index.427944-42'), value: 'expired'},
          {label: $t('CardManagement.index.427944-43'), value: 'cleared'},
          {label: $t('CardManagement.index.427944-44'), value: 'replaced'},
          {label: $t('CardManagement.index.427944-45'), value: 'stock'},
          {label: $t('CardManagement.index.427944-46'), value: 'start'}
        ]
      }
    },
    {
      title: $t('Detail.index.427958-27'),
      dataIndex: 'flowError',
      key: 'flowError',
      width: 100,
      ellipsis: true,
      search: {
        type: 'select',
        options: [
          {label: $t('CardManagement.index.427944-19'), value: true},
          {label: $t('CardManagement.index.427944-50'), value: false},
          {label: $t('CardManagement.index.427944-18'), value: 'flowError'},
        ],
      },
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
      title: $t('CardManagement.index.427944-51'),
      key: 'action',
      fixed: 'right',
      width: 220,
      scopedSlots: true
    }
  ]
}
