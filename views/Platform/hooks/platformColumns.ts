import { platformTypeList } from '../../data'
import { pick } from 'lodash-es'
import type { Translate } from '../../components/list/types'

export function getPlatformColumns($t: Translate) {
  return [
    {
      title: $t('Platform.index.838700-3'),
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      scopedSlots: true,
      width: '22%',
      search: {
        type: 'string'
      }
    },
    {
      title: $t('Platform.index.838700-1'),
      dataIndex: 'operatorName',
      key: 'operatorName',
      scopedSlots: true,
      width: '14%',
      search: {
        type: 'select',
        options: platformTypeList.map(item => {
          return pick(item, ['label', 'value'])
        })
      }
    },
    {
      title: $t('Platform.index.838700-7'),
      dataIndex: 'state',
      key: 'state',
      scopedSlots: true,
      width: '9%',
      search: {
        type: 'select',
        options: [
          { label: $t('Platform.index.838700-8'), value: 'enabled' },
          { label: $t('Platform.index.838700-9'), value: 'disabled' }
        ]
      }
    },
    {
      title: $t('Platform.index.838700-2'),
      dataIndex: 'explain',
      key: 'explain',
      ellipsis: true,
      search: { type: 'string' }
    },
    {
      title: $t('Platform.index.838700-10'),
      key: 'action',
      fixed: 'right',
      width: 100,
      scopedSlots: true
    }
  ]
}
