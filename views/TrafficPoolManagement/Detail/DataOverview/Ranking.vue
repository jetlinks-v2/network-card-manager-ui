<template>
  <div class="header">
    <TitleComponent :data="$t('TrafficPoolManagement.Detail.index.390590-12')"/>
    <TimeSelect
        key="flow-ranking"
        :type="'week'"
        :quickBtnList="quickBtnList"
        @change="onChange"
        :isShowTime="false"
        v-if="info.id"
    />
  </div>
  <div style="height: 100%; flex: 1; overflow-y: auto" v-if="info.id && list.length">
    <div v-for="item in list" :key="item.name" class="rank-item">
      <div>{{ item.cardId }}</div>
      <a-progress
          strokeColor="#1677FF"
          trailColor="#F5F5F5"
          :strokeLinecap="'butt'"
          :showInfo="false"
          :percent="Math.ceil((item.sum / topTotal) * 100)"
      />
      <div>{{ (item.sum || 0).toFixed(2) }}M</div>
    </div>
  </div>
  <div v-else style="margin-top: 100px">
    <j-empty/>
  </div>
</template>

<script setup>
import {useI18n} from "vue-i18n";
import {dashboard} from "@networkCardManager/api/trafficPoolManagement";
import {TRAFFIC_POOL_INFO_KEY} from "@networkCardManager/views/TrafficPoolManagement/Detail/utils";
import {quickBtnList} from "./data";
import TimeSelect from "@networkCardManager/views/components/TimeSelect.vue";

const {t: $t} = useI18n();
const list = ref([])
const topTotal = ref(0)
const info = inject(TRAFFIC_POOL_INFO_KEY, ref({}))

const handleSearch = (params = {}) => {
  dashboard(params).then((resp) => {
    if (resp.success) {
      list.value = resp.result.map(item => item.data.value)
      topTotal.value = list.value.reduce((pre, cur) => pre + cur.sum, 0)
    }
  });
}

const getEcharts = (data) => {
  let startTime = data.start;
  let endTime = data.end;
  const params = {
    "dashboard": "flow",
    "object": "networkCardFlow",
    "measurement": "rank",
    "dimension": "agg",
    "params": {
      "limit": 10,
      "from": startTime,
      "to": endTime,
      "poolId": info.value.id
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
  margin-bottom: 16px;
  flex-direction: column;
  gap: 16px;
}

.rank-item {
  display: flex;
  align-items: center;
  gap: 16px;
  &:not(:last-child) {
    margin-bottom: 16px;
  }
}
</style>
