<template>
  <div class="header">
    <TitleComponent data="告警统计" />
    <a-range-picker style="min-width: 300px" />
  </div>
  <div style="height: 100%; flex: 1">
    <Echarts :options="echartsOptions"/>
  </div>
</template>

<script setup>
import Echarts from "@/components/Dashboard/components/Charts.vue";

const echartsOptions = computed(() => {
  return {
    tooltip: {
      trigger: 'item'
    },
    title: {
      text: '35',
      subtext: '告警总数',
      fontSize: 20,
      left: 'center',
      top: 'center',
    },
    series: [
      {
        type: 'pie',
        radius: ['60%', '80%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: false
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 100, name: 'Search Engine' }
        ]
      }
    ]
  };
})
</script>

<style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
