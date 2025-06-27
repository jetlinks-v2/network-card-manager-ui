<template>
  <j-page-container>
    <pro-search
        :columns="columns"
        target="traffic-pool-management"
        @search="handleSearch"
    />
    <FullPage>
      <j-pro-table
          ref="platformRef"
          :columns="columns"
          :request="query"
          :defaultParams="{
          sorts: [{ name: 'createTime', order: 'desc' }]
        }"
          :params="params"
          mode="CARD"
          :gridColumns="[1]"
      >
        <template #headerLeftRender>
          <a-space>
            <j-permission-button
                :hasPermission="'iot-card/Platform:add'"
                type="primary"
                ghost
                @click="handleSyncClick"
            >
              <AIcon type="SyncOutlined"/>
              同步状态
            </j-permission-button>
          </a-space>
        </template>
        <template #card="slotProps">
          <CardBox
              :value="slotProps"
              v-bind="slotProps"
              :showStatus="false"
              @click="handleClick(slotProps)"
          >
            <template #img>
              <slot name="img">
                <img
                    :src="iotCard.iotCardBg"
                />
              </slot>
            </template>
            <template #content>
              <div class="card-item-content">
                <div class="card-item-content-header">
                  <div class="left">
                    <j-ellipsis>
                      {{ slotProps.id }}
                    </j-ellipsis>
                  </div>
                  <div class="right">
                    <AIcon
                        type="ClockCircleOutlined"
                        style="margin-right: 10px"
                    />
                    <span>{{ dayjs(slotProps.updateTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
                  </div>
                </div>
                <div class="flex-center">
                  <div class="left-progress">
                    <div class="flex-center">
                      <div class="text"><span class="bold-text large-text">86.55M</span>/100.00M</div>
                      <div class="text">剩余： 13.12M</div>
                    </div>
                    <a-progress status="active" :percent="30" :show-info="false"/>
                  </div>
                  <div>
                    <div>激活卡片数
                      <a-tooltip>
                        <AIcon type="QuestionCircleOutlined"/>
                      </a-tooltip>
                    </div>
                    <div class="text"><span class="bold-text">6</span>/20</div>
                  </div>
                </div>
              </div>
            </template>
          </CardBox>
        </template>
      </j-pro-table>
    </FullPage>
  </j-page-container>
  <Sync v-if="sync.visible" :data="sync.num" @close="sync.visible = false" />
</template>

<script setup>
import {useI18n} from "vue-i18n";
import {query} from "@networkCardManager/api/cardManagement";
import {iotCard} from '../../assets'
import dayjs from "dayjs";
import {useMenuStore} from "@/store";
import Sync from './components/Sync.vue'

const {t: $t} = useI18n();
const menuStore = useMenuStore()
const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    search: {
      type: 'string'
    }
  },
  {
    title: '运营商',
    dataIndex: 'state',
    key: 'state',
    search: {
      type: 'select',
      options: [
        {label: $t('Platform.index.838700-8'), value: 'enabled'},
        {label: $t('Platform.index.838700-9'), value: 'disabled'},
        {label: $t('Platform.index.838700-9'), value: 'disabled1'}
      ]
    }
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    search: {
      type: 'date',
    },
  },
]
const params = ref({})
const sync = reactive({
  visible: false,
  num: 9
})

const statusColor = {
  enabled: 'success',
  disabled: 'error',
  disabled1: 'exception',
}
const handleSearch = (dt) => {
  params.value = dt
}

const handleClick = (dt) => {
  menuStore.jumpPage('iot-card/TrafficPoolManagement/Detail', {
    params: {id: dt.id}
  })
}

const handleSyncClick = () => {
  sync.visible = true
}
</script>

<style lang="less" scoped>
.flex-center {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 48px;
}

.card-item-content-header {
  .flex-center();
  margin-bottom: 24px;

  .left {
    font-size: 18px;
    font-weight: 800;
    flex: 1;
    min-width: 0;
  }

  .right {
    width: 165px;
  }
}

.left-progress {
  flex: 1;
  min-width: 0;
}

.text {
  color: #777777;
}

.bold-text {
  color: #000000;
  font-weight: 800;
}

.large-text {
  font-size: 18px;
}
</style>
