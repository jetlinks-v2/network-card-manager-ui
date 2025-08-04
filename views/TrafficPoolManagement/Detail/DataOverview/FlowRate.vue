<template>
  <div class="header">
    <div style="flex: 1; min-width: 0">
      <TitleComponent :data="$t('TrafficPoolManagement.Detail.index.390590-9')"/>
    </div>
    <div style="width: 350px" v-if="info.id">
      <TimeSelect
          key="flow-rate"
          :type="'week'"
          :quickBtnList="quickBtnList"
          @change="onChange"
          :isShowTime="false"
      />
    </div>
  </div>
  <div v-if="info.id">
    <LineChart
        :showX="true"
        :showY="true"
        style="min-height: 300px"
        :chartData="flowData"
    />
  </div>
  <div v-else style="margin-top: 100px">
    <j-empty/>
  </div>
</template>

<script setup>
import LineChart from "@networkCardManager/views/components/LineChart.vue";
import {useI18n} from "vue-i18n";
import {dashboard} from "@networkCardManager/api/trafficPoolManagement";
import {TRAFFIC_POOL_INFO_KEY} from "@networkCardManager/views/TrafficPoolManagement/Detail/utils";
import TimeSelect from "@networkCardManager/views/components/TimeSelect.vue";
import {getTimes, quickBtnList} from "./data";

const {t: $t} = useI18n();
const info = inject(TRAFFIC_POOL_INFO_KEY, ref({}))

const flowData = ref([])
const handleSearch = (params = {}) => {
  dashboard(params).then((resp) => {
    if (resp.success) {
      flowData.value = resp.result.reverse().map(i => ({...i.data, value: Number(i.data.value), date: i.data.timeString}))
    }
  });
}

const getEcharts = (data) => {
  let startTime = data.start;
  let endTime = data.end;
  const params = {
    "dashboard": "flow",
    "object": "networkCardFlow",
    "measurement": "trend",
    "dimension": "agg",
    "params": {
      ...getTimes(startTime, endTime),
      "poolId": info.value.id,
    }
  }
  handleSearch(params)
};

const onChange = (val) => {
  if (info.value.id) {
    getEcharts(val)
  }
}
</script>

<style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  width: 100%;
}
</style>
