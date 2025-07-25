<template>
  <div class="progress-container">
    <a-tooltip
        :title="data?.alarmEnable ?
        `${$t('TrafficPoolManagement.index.390590-5')} < ${data.alarmConfig?.flowThreshold || data.alarmConfig?.flowTrafficThreshold}${data.alarmConfig?.flowThreshold ? 'M'
        : '%'}` : ``"
    >
      <div class="progress-box">
        <div class="progress-item" :style="{backgroundColor: getStstusColor(data), width: getLeftValue(data)[0]}"></div>
        <div class="progress-value"
             :style="{left: getLeftValue(data)[0], backgroundColor: getStstusColor(data)}">
          {{ data.flowPercentage || 0 }}%
        </div>
      </div>
      <div v-if="data?.alarmEnable" :style="{left: getLeftValue(data)[1]}" class="progress-alarm"></div>
    </a-tooltip>
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

const getLeftValue = (dt) => {
  if (dt.alarmEnable && dt.totalFlow) {
    const _flowPercentage = dt.flowPercentage > 100 ? 100 : dt.flowPercentage
    if (dt.alarmConfig?.flowThreshold !== undefined) {
      const _value = dt.alarmConfig.flowThreshold / dt.totalFlow * 100
      return [`${_flowPercentage}%`, `${_value}%`]
    } else if (dt.alarmConfig.flowTrafficThreshold !== undefined && dt.totalFlow) {
      return [`${_flowPercentage}%`, `${(dt.alarmConfig.flowTrafficThreshold)}%`]
    }
  }
  return [0, 0]
}

const getStstusColor = (dt) => {
  if (dt.flowPercentage > 100) {
    return '#ff4d4f'
  } else if (dt?.alarmEnable && dt.totalFlow) {
    if (dt.alarmConfig.flowThreshold !== undefined) {
      if (dt.usedFlow > dt.alarmConfig.flowThreshold) {
        return '#faad14'
      }
    } else if (dt.alarmConfig.flowTrafficThreshold !== undefined) {
      if (dt.usedFlow / dt.totalFlow * 100 > dt.alarmConfig.flowTrafficThreshold) {
        return '#faad14'
      }
    }
  }
  return 'rgb(22, 119, 255)'
}
</script>

<style lang="less" scoped>
.progress-container {
  position: relative;

  span {
    display: inline-block;
  }

  .progress-alarm {
    position: absolute;
    top: 0;
    background-color: #CCCCCC;
    width: 2px;
    height: 16px;
  }
}

.progress-box {
  top: 4px;
  width: 100%;
  height: 8px;
  border-radius: 23px;
  background-color: #F0F0F0;
  position: relative;

  .progress-item {
    position: absolute;
    top: 0;
    width: 0;
    height: 8px;
    border-radius: 23px;
    background-color: rgb(22, 119, 255);
  }

  .progress-value {
    position: absolute;
    left: 0;
    top: -4px;
    width: 40px;
    height: 16px;
    border-radius: 8px;
    border: 1px solid #FFFFFF;
    margin: 0px -3px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    background-color: rgb(22, 119, 255);
  }
}
</style>
