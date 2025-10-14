<template>
  <div class="header">
   <div style="width: 200px">
     <TitleComponent :data="$t('TrafficPoolManagement.Detail.index.390590-10')" />
   </div>
    <TimeSelect
        v-if="info.id"
        key="flow-rate"
        :type="'week'"
        :quickBtnList="quickBtnList"
        @change="onChange"
        :isShowTime="false"
    />
  </div>
  <div style="height: 100%; flex: 1; display: flex;align-items: center; justify-content: center">
    <Echarts :options="echartsOptions" @subTitleClick="onClick"/>
<!--    <a-progress type="circle" :percent="100" :width="200" :stroke-color="{-->
<!--      '0%': '#FF4D4F',-->
<!--      '100%': '#FF4D4F',-->
<!--    }">-->
<!--      <template #format="percent">-->
<!--        <div style="color: rgba(0,0,0,.85)">{{ total }}</div>-->
<!--        <div>-->
<!--          {{$t('TrafficPoolManagement.Detail.index.390590-11')}}-->
<!--        </div>-->
<!--      </template>-->
<!--    </a-progress>-->
  </div>
</template>

<script setup>
import Echarts from "@/components/Dashboard/components/Charts.vue";
import {useI18n} from "vue-i18n";
import {queryAlarmCount} from "@network-card-manager-ui/api/trafficPoolManagement";
import {quickBtnList} from "./data";
import {TRAFFIC_POOL_INFO_KEY} from "../utils";
import TimeSelect from "@network-card-manager-ui/views/components/TimeSelect.vue";
import {useMenuStore} from "@/store";

const {t: $t} = useI18n();

const info = inject(TRAFFIC_POOL_INFO_KEY, ref({}))
const total = ref(0)
const menuStore = useMenuStore()
const echartsOptions = computed(() => {
  return {
    // tooltip: {
    //   trigger: 'item'
    // },
    title: {
      text: total.value,
      subtext: $t('TrafficPoolManagement.Detail.index.390590-11'),
      fontSize: 40,
      left: 'center',
      top: 'center',
      triggerEvent: true
    },
    series: [
      {
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
        },
        color: ['#FF4D4F'],
        emphasis: {
          label: {
            show: false
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 100, name: $t('TrafficPoolManagement.Detail.index.390590-11') }
        ]
      }
    ]
  };
})

const handleSearch = async (data) => {
  let startTime = data.start;
  let endTime = data.end;
  const resp = await queryAlarmCount(info.value.id, {
    terms: [
      {
        column: 'alarmTime',
        termType: 'btw',
        value: [startTime, endTime]
      }
    ]
  })
  if(resp.success){
    total.value = resp.result || 0
  }
}

const onChange = (val) => {
  if (info.value.id) {
    handleSearch(val)
  }
}

const onClick = () => {
  menuStore.jumpPage(`rule-engine/Alarm/Log`, {query: {tab: 'networkCardPool', id: info.value.id}});
}
</script>

<style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
