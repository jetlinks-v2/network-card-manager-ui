import { computed, ref } from 'vue'
import { useListStatus } from '../../components/list/useListStatus'
import { readCount } from '../../components/list/query'
import type { ListTableRef, PlatformRow, RowAction } from '../../components/list/types'
import { getPlatformColumns } from './platformColumns'

import { onlyMessage } from '@jetlinks-web/utils'
import { queryList, update, del } from '../../../api/platform'
import { useMenuStore } from '@jetlinks-web-core/store'

import { useI18n } from 'vue-i18n';
import { platformTypeList } from "../../data";

export function usePlatformList() {
  const { t: $t } = useI18n();
  const menuStory = useMenuStore()

  const platformRef = ref<ListTableRef>()
  const { params, status, statusOptions, listError, requestList, changeStatus, handleSearch } = useListStatus({
    request: queryList,
    column: 'state', options: [
      { value: 'enabled', label: 'Platform.index.838700-8' },
      { value: 'disabled', label: 'Platform.index.838700-9' },
    ], t: $t,
    count: async query => {
      const response = await queryList({ ...query, pageIndex: 0, pageSize: 1 })
      if (!response.success) throw new Error('Platform count failed')
      return readCount(response.result?.total)
    },
  })
  const columns = computed(() => getPlatformColumns($t))

  const platformLabel = (value: string) => platformTypeList.find(item => item.value === value)?.label
  const platformColor = (value: string) => platformTypeList.find(item => item.value === value)?.tagColor
  const openDetail = (row: PlatformRow) => menuStory.jumpPage('iot-card/Platform/Detail', { params: { id: row.id } })

  const statusUpdate = (data: Pick<PlatformRow, 'id' | 'config' | 'operatorName'> & { state: string }) => {
    const response = update(data)
    response.then((res: { status: number }) => {
      if (res.status === 200) {
        onlyMessage($t('Platform.index.838700-11'))
        platformRef.value?.reload()
      }
    })
    return response
  }

  const getActions = (
    data: PlatformRow
  ): RowAction[] => {
    if (!data) return []
    return [
      {
        key: 'update',
        text: $t('Platform.index.838700-12'),
        tooltip: {
          title: $t('Platform.index.838700-12')
        },
        icon: 'EditOutlined',
        onClick: () => {
          menuStory.jumpPage('iot-card/Platform/Detail', {
            params: { id: data.id }
          })
        }
      },
      {
        key: 'action',
        text: data.state?.value === 'enabled' ? $t('Platform.index.838700-9') : $t('Platform.index.838700-8'),
        tooltip: {
          title: data.state?.value === 'enabled' ? $t('Platform.index.838700-9') : $t('Platform.index.838700-8')
        },
        icon:
          data.state?.value === 'enabled' ? 'StopOutlined' : 'PlayCircleOutlined',
        popConfirm: {
          title: $t(data.state?.value === 'enabled' ? 'SimList.confirmDisable' : 'SimList.confirmEnable'),
          okText: $t('CardManagement.index.427944-55'),
          cancelText: $t('Platform.index.838700-15'),
          onConfirm: () => {
            if (data.state?.value === 'enabled') {
              return statusUpdate({
                id: data.id,
                config: { ...data.config },
                state: 'disabled',
                operatorName: data.operatorName
              })
            } else {
              return statusUpdate({
                id: data.id,
                config: { ...data.config },
                state: 'enabled',
                operatorName: data.operatorName
              })
            }
          }
        }
      },
      {
        key: 'delete',
        text: $t('Platform.index.838700-16'),
        tooltip: {
          title: data.state?.value !== 'enabled' ? $t('Platform.index.838700-16') : $t('Platform.index.838700-17')
        },
        disabled: data.state?.value === 'enabled',
        popConfirm: {
          title: $t('Platform.index.838700-18'),
          okText: $t('CardManagement.index.427944-55'),
          cancelText: $t('Platform.index.838700-15'),
          onConfirm: () => {
            const response: any = del(data.id)
            response.then((resp: any) => {
              if (resp.status === 200) {
                onlyMessage($t('Platform.index.838700-19'))
                platformRef.value?.reload()
              } else {
                onlyMessage($t('Platform.index.838700-20'), 'error')
              }
            })
            return response
          }
        },
        icon: 'DeleteOutlined'
      }
    ]
  }

  /**
   * 新增
   */
  const handleAdd = () => {
    menuStory.jumpPage('iot-card/Platform/Detail', {
      params: { id: ':id' }
    })
  }

  return { platformRef, params, columns, requestList, handleSearch, status, statusOptions, changeStatus, listError, getActions, handleAdd, platformLabel, platformColor, openDetail }
}
