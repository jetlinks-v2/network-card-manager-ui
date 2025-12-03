<template>
  <div class="header">
    <TitleComponent :data="$t('TrafficPoolManagement.Detail.index.390590-7')"/>
    <j-permission-button type="link" :hasPermission="true" @click="onSyncLog">
      {{ $t('Detail.index.427958-29') }}
    </j-permission-button>
  </div>
  <div class="progress">
    <div class="flex-center">
      <div class="text"><span class="bold-text large-text">{{
          info.usedFlow?.toFixed(2)
        }}M</span>/{{ info.totalFlow?.toFixed(2) }}M
      </div>
      <div class="text">{{ $t('TrafficPoolManagement.index.390590-3') }}： {{ info.residualFlow?.toFixed(2) }}M</div>
    </div>
    <Progress :data="info" />
  </div>
  <div class="charts-box">
    <div style="height: 100%; width: 320px">
      <Echarts :options="echartsOptions"/>
    </div>
    <div class="right">
      <div v-for="(item, index) in (statusNumber.status || [])" :key="item.status?.value" class="right-item">
        <div class="right-item-item">
          <div class="radius-box" :style="{'background-color': colors[index % colors.length]}"></div>
        </div>
        <div class="right-item-item-center">
          <div>{{ item.status?.text || '--' }}</div>
          <div>{{ item.numberPercentage }}%</div>
        </div>
        <div class="right-item-item">
          {{ item.number || 0 }}
        </div>
      </div>
    </div>
  </div>
  <SyncRecord v-if="sync.visible" :data="sync.data" @close="sync.visible = false" />
</template>

<script setup>
import Echarts from "@jetlinks-web-core/components/Dashboard/components/Charts.vue";
import {colors} from "./data";
import {useI18n} from "vue-i18n";
import {TRAFFIC_POOL_INFO_KEY} from "../utils";
import {queryStatusNumber} from "@network-card-manager-ui/api/trafficPoolManagement";
import SyncRecord from "../../components/SyncRecord/index.vue";
import Progress from "../../components/Progress.vue";

const {t: $t} = useI18n();

const info = inject(TRAFFIC_POOL_INFO_KEY, ref({}))
const statusNumber = ref({})

const sync = reactive({
  visible: false,
  data: {}
})

const echartsOptions = computed(() => {
  return {
    color: colors,
    tooltip: {
      trigger: 'axis',
      valueFormatter: (value) => `${value}%`,
    },
    title: {
      text: statusNumber.value.total || 0,
      subtext: $t('TrafficPoolManagement.Detail.index.390590-46'),
      fontSize: 20,
      left: 'center',
      top: 80,
    },
    series: [
      {
        type: 'pie',
        radius: [50, 100],
        center: ['50%', '50%'],
        // roseType: 'area',
        minAngle: 10,
        itemStyle: {
          borderRadius: 8
        },
        label: {
          normal: {
            show: false
          }
        },
        data: (statusNumber.value.status || [])?.map(item => ({
          value: Math.pow(item.number, 0.4),
          name: item.status?.text,
        }))
      }
    ]
  }
})

const onSyncLog = () => {
  sync.visible = true
  sync.data = info.value
}

const handleSearch = async (id) => {
  const resp = await queryStatusNumber({
    "paging":false,
    "where": `poolId eq ${id}`
  })
  if(resp.success){
    statusNumber.value = resp.result
  }
}

watch(() => info.value.id, (newVal) => {
  if (newVal) {
    handleSearch(newVal)
  }
}, {
  deep: true,
  immediate: true,
})
</script>

<style lang="less" scoped>
.flex-center {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.charts-box {
  display: flex;
  min-height: 0;
  flex: 1;
  margin-top: 16px;
  justify-content: space-between;
  align-items: center;

  .right {
    flex: 1;
    min-width: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;

    .right-item {
      display: flex;
      align-items: center;

      .right-item-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .right-item-item-center {
        display: flex;
        width: 200px;
        justify-content: space-between;
        margin: 0 36px 0 12px;
      }

      .radius-box {
        width: 12px;
        height: 12px;
        //border-radius: 50%;
        margin-right: 12px;
      }
    }
  }
}
</style>
