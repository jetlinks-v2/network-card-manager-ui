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
                          <AIcon type="PlusOutlined" />新增
                          </j-button> -->
            <j-permission-button
              @click="handleAdd"
              :hasPermission="'iot-card/Platform:add'"
              type="primary"
            >
              <AIcon type="PlusOutlined" />新增
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
                  <div class="card-item-content-text">平台类型</div>
                  <div>{{ slotProps.operatorName }}</div>
                </a-col>
                <a-col :span="12">
                  <div class="card-item-content-text">说明</div>
                  <j-ellipsis>{{ slotProps.explain }}</j-ellipsis>
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
import { iotCard, home } from '../../assets'
const menuStory = useMenuStore()
const router = useRouter()
const platformRef = ref<Record<string, any>>({})
const params = ref<Record<string, any>>({})

const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    search: {
      type: 'string'
    }
  },
  {
    title: '平台类型',
    dataIndex: 'operatorName',
    key: 'operatorName',
    search: {
      type: 'select',
      options: [
        { label: '移动OneLink', value: 'onelink' },
        { label: '电信Ctwing', value: 'ctwing' },
        { label: '联通Unicom', value: 'unicom' }
      ]
    }
  },
  {
    title: '状态',
    dataIndex: 'state',
    key: 'state',
    scopedSlots: true,
    width: 120,
    search: {
      type: 'select',
      options: [
        { label: '启用', value: 'enabled' },
        { label: '禁用', value: 'disabled' }
      ]
    }
  },
  {
    title: '说明',
    dataIndex: 'explain',
    key: 'explain',
    ellipsis: true
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 120,
    scopedSlots: true
  }
]

const statusUpdate = (data: any) => {
  const response = update(data)
  response.then((res) => {
    if (res.status === 200) {
      onlyMessage('操作成功')
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
      text: '编辑',
      tooltip: {
        title: '编辑'
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
      text: data.state.value === 'enabled' ? '禁用' : '启用',
      tooltip: {
        title: data.state.value === 'enabled' ? '禁用' : '启用'
      },
      icon:
        data.state.value === 'enabled' ? 'StopOutlined' : 'PlayCircleOutlined',
      popConfirm: {
        title: `确认${data.state.value === 'enabled' ? '禁用' : '启用'}？`,
        okText: ' 确定',
        cancelText: '取消',
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
      text: '删除',
      tooltip: {
        title: data.state.value !== 'enabled' ? '删除' : '请先禁用再删除'
      },
      disabled: data.state.value === 'enabled',
      popConfirm: {
        title: '确认删除?',
        okText: ' 确定',
        cancelText: '取消',
        onConfirm: () => {
          const response: any = del(data.id)
          response.then((resp: any) => {
            if (resp.status === 200) {
              onlyMessage('操作成功！')
              platformRef.value?.reload()
            } else {
              onlyMessage('操作失败！', 'error')
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
