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
          :gridColumns="[2]"
      >
        <template #card="slotProps">
          <CardBox
              :value="slotProps"
              v-bind="slotProps"
              :showStatus="false"
              @click="handleClick(slotProps)"
          >
            <template #img>
              <div class="img-box">
                <img :src="imgMap.get('onelink')"/>
              </div>
            </template>
            <template #content>
              <div class="card-item-content">
                <div class="card-item-content-header">
                  <div class="left">
                    <j-ellipsis>
                      {{ slotProps.alias || slotProps.name }}
                    </j-ellipsis>
                  </div>
                  <div class="right">
                    <AIcon
                        type="ClockCircleOutlined"
                        style="margin-right: 10px; color: #1677FF"
                    />
                    <span>{{ dayjs(slotProps.updateTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
                  </div>
                </div>
                <div class="flex-center">
                  <div class="left-progress">
                    <div class="flex-center">
                      <div class="text"><span class="bold-text large-text">{{ slotProps.usedFlow.toFixed(2) }}M</span>/{{
                          slotProps.totalFlow.toFixed(2)
                        }}M
                      </div>
                      <div class="text">{{ $t('TrafficPoolManagement.index.390590-3') }}： <span
                          class=" bold-text">{{ slotProps.residualFlow.toFixed(2) }}M</span></div>
                    </div>
                    <Progress :data="slotProps" />
                  </div>
                  <div>
                    <div class="text">{{ $t('TrafficPoolManagement.index.390590-4') }}</div>
                    <div class="text"><span class="bold-text">{{
                        slotProps.usingCardTotal
                      }}</span>/{{ slotProps.cardTotal }}
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </CardBox>
        </template>
      </j-pro-table>
    </FullPage>
  </j-page-container>
</template>

<script setup>
import {useI18n} from "vue-i18n";
import {query} from "@networkCardManager/api/trafficPoolManagement";
import dayjs from "dayjs";
import {useMenuStore} from "@/store";
import Onelink from '@networkCardManager/assets/traffic-pool/onelink.png'
import Telecom from '@networkCardManager/assets/traffic-pool/telecom.png'
import Unicom from '@networkCardManager/assets/traffic-pool/unicom.png'
import {OperatorList} from "@networkCardManager/views/data";
import Progress from "./components/Progress.vue";

const {t: $t} = useI18n();
const menuStore = useMenuStore()

const imgMap = new Map()
imgMap.set('onelink', Onelink)
imgMap.set('ctwing', Telecom)
imgMap.set('unicom', Unicom)

const columns = [
  {
    title: $t('Detail.index.838702-2'),
    dataIndex: 'name',
    key: 'name',
    search: {
      type: 'string'
    }
  },
  {
    title: $t('TrafficPoolManagement.Detail.index.390590-0'),
    dataIndex: 'platformType',
    key: 'platformType',
    search: {
      type: 'select',
      options: async () => {
        return OperatorList
      }
    }
  },
  {
    title: $t('CardManagement.index.427944-16'),
    dataIndex: 'updateTime',
    key: 'updateTime',
    search: {
      type: 'date',
    },
  },
]
const params = ref({})


const handleSearch = (dt) => {
  params.value = dt
}

const handleClick = (dt) => {
  menuStore.jumpPage('iot-card/TrafficPoolManagement/Detail', {
    params: {id: dt.id}
  })
}
</script>

<style lang="less" scoped>
.flex-center {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 48px;
}

.card-item-content {
  padding-right: 18px;
}

.card-item-content-header {

  .flex-center();
  margin-bottom: 16px;

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

.img-box {
  background: #F5F5F5;
  width: 64px;
  height: 64px;
  border-radius: 6px;
}

.left-progress {
  flex: 1;
  min-width: 0;
}

.text {
  color: #8D9399;
}

.bold-text {
  color: #1F2429;
}

.large-text {
  font-size: 18px;
}
</style>
