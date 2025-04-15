<!-- 平台对接 -->
<template>
  <j-page-container>
    <pro-search
      :columns="columns"
      target="platform-search"
      @search="handleSearch"
    />
    <FullPage>
      <j-pro-table
        ref="platformRef"
        :columns="columns"
        :request="queryList"
        :defaultParams="{
          sorts: [{ name: 'createTime', order: 'desc' }]
        }"
        :params="params"
        modeValue="CARD"
        :gridColumns="[3, 3, 3]"
      >
        <template #headerLeftRender>
          <a-space>
            <!-- <j-button type="primary" @click="handleAdd">
                          <AIcon type="PlusOutlined" />{{ $t('Platform.index.838700-0') }}
                          </j-button> -->
            <j-permission-button
              @click="handleAdd"
              :hasPermission="'iot-card/Platform:add'"
              type="primary"
            >
              <AIcon type="PlusOutlined" />{{ $t('Platform.index.838700-0') }}
            </j-permission-button>
          </a-space>
        </template>
        <template #card="slotProps">
          <CardBox
            :value="slotProps"
            :actions="getActions(slotProps, 'card')"
            v-bind="slotProps"
            :status="slotProps.state.value"
            :statusText="slotProps.state.text"
            :statusNames="{
              enabled: 'processing',
              disabled: 'error'
            }"
          >
            <template #img>
              <slot name="img">
                <img :src="iotCard.iotCardBg" />
              </slot>
            </template>
            <template #content>
              <h3
                style="
                  font-size: 16px;
                  width: calc(100% - 90px);
                  margin-bottom: 18px;
                "
              >
                <j-ellipsis>
                  {{ slotProps.name }}
                </j-ellipsis>
              </h3>
              <a-row>
                <a-col :span="12">
                  <div class="card-item-content-text">{{ $t('Platform.index.838700-1') }}</div>
                  <div>{{ platformTypeList.find(item => item.value === slotProps.operatorName)?.label }}</div>
                </a-col>
                <a-col :span="12">
                  <div class="card-item-content-text">{{ $t('Platform.index.838700-2') }}</div>
                  <j-ellipsis>{{ slotProps.explain || '--' }}</j-ellipsis>
                </a-col>
              </a-row>
            </template>
            <template #actions="item">
              <j-permission-button
                :disabled="item.disabled"
                :popConfirm="item.popConfirm"
                :tooltip="{
                  ...item.tooltip
                }"
                @click="item.onClick"
                :hasPermission="'iot-card/Platform:' + item.key"
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
        <template #operatorName="slotProps">
          {{platformTypeList.find(item => item.value === slotProps.operatorName)?.label}}
        </template>
        <template #state="slotProps">
          <a-badge
            :text="slotProps.state.text"
            :status="slotProps.state.value === 'disabled' ? 'error' : 'success'"
          />
        </template>
        <template #action="slotProps">
          <a-space :size="16">
            <template v-for="i in getActions(slotProps, 'table')" :key="i.key">
              <j-permission-button
                :disabled="i.disabled"
                :popConfirm="i.popConfirm"
                :tooltip="{
                  ...i.tooltip
                }"
                :danger="i.key === 'delete'"
                @click="i.onClick"
                type="link"
                style="padding: 0px"
                :hasPermission="'iot-card/Platform:' + i.key"
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
  </j-page-container>
</template>

<script setup lang="ts">
import { onlyMessage } from '@jetlinks-web/utils'
import { queryList, update, del } from '../../api/platform'
import { useMenuStore } from '@/store'
import { iotCard } from '../../assets'
import { useI18n } from 'vue-i18n';
import { platformTypeList } from "../data";
import { pick } from 'lodash-es';

const { t: $t } = useI18n();
const menuStory = useMenuStore()
const router = useRouter()
const platformRef = ref<Record<string, any>>({})
const params = ref<Record<string, any>>({})

const columns = [
  {
    title: $t('Platform.index.838700-3'),
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    search: {
      type: 'string'
    }
  },
  {
    title: $t('Platform.index.838700-1'),
    dataIndex: 'operatorName',
    key: 'operatorName',
    scopedSlots: true,
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
    width: 120,
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
    ellipsis: true
  },
  {
    title: $t('Platform.index.838700-10'),
    key: 'action',
    fixed: 'right',
    width: 150,
    scopedSlots: true
  }
]

const statusUpdate = (data: any) => {
  const response = update(data)
  response.then((res) => {
    if (res.status === 200) {
      onlyMessage($t('Platform.index.838700-11'))
      platformRef.value?.reload()
    }
  })
  return response
}

const getActions = (
  data: Partial<Record<string, any>>,
  type: 'card' | 'table'
): any[] => {
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
        //   router.push(`/iot-card/Platform/detail/${data.id}`);
        menuStory.jumpPage('iot-card/Platform/Detail', {
          params: { id: data.id }
        })
      }
    },
    {
      key: 'action',
      text: data.state.value === 'enabled' ? $t('Platform.index.838700-9') : $t('Platform.index.838700-8'),
      tooltip: {
        title: data.state.value === 'enabled' ? $t('Platform.index.838700-9') : $t('Platform.index.838700-8')
      },
      icon:
        data.state.value === 'enabled' ? 'StopOutlined' : 'PlayCircleOutlined',
      popConfirm: {
        title: `确认${data.state.value === 'enabled' ? $t('Platform.index.838700-9') : $t('Platform.index.838700-8')}？`,
        okText: ' 确定',
        cancelText: $t('Platform.index.838700-15'),
        onConfirm: () => {
          if (data.state.value === 'enabled') {
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
        title: data.state.value !== 'enabled' ? $t('Platform.index.838700-16') : $t('Platform.index.838700-17')
      },
      disabled: data.state.value === 'enabled',
      popConfirm: {
        title: $t('Platform.index.838700-18'),
        okText: ' 确定',
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

const handleSearch = (e: any) => {
  params.value = e
}

/**
 * 新增
 */
const handleAdd = () => {
  menuStory.jumpPage('iot-card/Platform/Detail', {
    params: { id: ':id' }
  })
}
</script>

<style scoped lang="less"></style>
