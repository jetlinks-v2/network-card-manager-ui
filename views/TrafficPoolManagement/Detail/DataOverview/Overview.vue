<template>
  <div class="header">
    <TitleComponent data="本月流量池概览"/>
    <j-permission-button type="link" :hasPermission="true">
      同步记录
    </j-permission-button>
  </div>
  <div class="progress">
    <div class="flex-center">
      <div class="text"><span class="bold-text large-text">86.55M</span>/100.00M</div>
      <div class="text">剩余： 13.12M</div>
    </div>
    <a-progress status="active" :percent="30" :show-info="false"/>
  </div>
  <div style="height: 350px" class="flex-center">
    <div style="height: 100%; flex: 1">
      <Echarts :options="echartsOptions"/>
    </div>
    <div style="width: 300px">
      <div v-for="(item, index) in list" :key="item.name" class="flex-center" style="margin-bottom: 12px">
        <div style="display: flex; align-items: center">
          <div class="radius-box" :style="{'background-color': colors[index % colors.length]}"></div>
          {{ item.name }}
        </div>
        <div class="flex-center">
          <span>26%</span>
          <span>{{ item.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Echarts from "@/components/Dashboard/components/Charts.vue";
import {colors} from "./data";

const list = [
  {value: 30, name: '激活（正常）'},
  {value: 35, name: '测试激活'},
  {value: 40, name: '拆机'},
  {value: 45, name: '停机（已停用）'},
  {value: 50, name: '运营商管理状态'},
  {value: 60, name: 'rose 6'},
  {value: 70, name: 'rose 7'},
  {value: 80, name: 'rose 8'}
]
const echartsOptions = computed(() => {
  return {
    color: colors,
    grid: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    },
    tooltip: {
      trigger: 'axis',
      valueFormatter: (value) => `${value}%`,
    },
    title: {
      text: '20',
      subtext: '卡片总数',
      fontSize: 25,
      left: 'center',
      top: 'center',
    },
    series: [
      {
        type: 'pie',
        radius: [50, 180],
        center: ['50%', '55%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 8
        },
        label: {
          normal: {
            show: false
          }
        },
        data: list
      }
    ]
  }
})
</script>

<style lang="less" scoped>
.flex-center {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 48px;
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

.radius-box {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 10px;
}
</style>
