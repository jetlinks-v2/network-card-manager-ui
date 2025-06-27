<template>
  <div class="header">
    <TitleComponent data="流量统计" />
    <a-range-picker style="min-width: 300px" />
  </div>
  <div style="height: 320px">
    <Echarts :options="echartsOptions"/>
  </div>
</template>

<script setup>
import * as echarts from "echarts";
import Echarts from "@/components/Dashboard/components/Charts.vue";

const echartsOptions = computed(() => {
  return {
    grid: {
      left: '5%',
      right: '5%',
      top: '5%',
      // bottom: '5%',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    xAxis: [
      {
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
    ],
    yAxis: [
      {
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            type: 'dotted',
          },
        },
      },
    ],
    series: [
      {
        name: '123',
        type: 'line',
        symbol: 'circle',
        showSymbol: false,
        smooth: true,
        itemStyle: {
          normal: {
            lineStyle: {
              width: 1,
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(
                  0,
                  1,
                  0,
                  0,
                  [
                    {
                      offset: 0.1,
                      color: '#fff',
                    },
                    {
                      offset: 1,
                      color: '#498BEF',
                    },
                  ],
              ),
            },
          },
        },
        data: [820, 932, 901, 934, 1290, 1330, 1320]
      },
    ],
  };
})
</script>

<style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
</style>
