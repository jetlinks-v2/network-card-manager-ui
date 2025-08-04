<template>
  <div class="progress-container">
    <a-tooltip
        :title="data?.alarmEnable ?
        `${$t('TrafficPoolManagement.index.390590-5',[getAlarmValue])}` : ``"
    >
      <div class="progress-box">
        <div class="progress-item" :style="{backgroundColor: getStstusColor, width: getLeftValue[0]}"></div>
        <div class="progress-value"
             :style="{left: getLeftValue[0], backgroundColor: getStstusColor}">
          {{ data.flowPercentage || 0 }}%
        </div>
      </div>
      <div v-if="data?.alarmEnable" :style="{left: getLeftValue[1]}" class="progress-alarm"></div>
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

const getLeftValue = computed(() => {
  if (props.data.alarmEnable && props.data.totalFlow) {
    const _alarmConfig = props.data.alarmConfig || {}
    const _flowPercentage = props.data.flowPercentage > 100 ? 100 : props.data.flowPercentage
    if (_alarmConfig?.flowThreshold !== undefined) {
      const _value = (props.data.totalFlow - _alarmConfig.flowThreshold) / props.data.totalFlow * 100
      return [`${_flowPercentage}%`, `${_value}%`]
    } else if (_alarmConfig.flowTrafficThreshold !== undefined) {

      return [`${_flowPercentage}%`, `${(100 - _alarmConfig.flowTrafficThreshold)}%`]
    }
  }
  return [0, 0]
})

const getAlarmValue = computed(() => {
  if (props.data.alarmEnable) {
    const _alarmConfig = props.data.alarmConfig || {}
    if (_alarmConfig.flowThreshold !== undefined) {
      return `${_alarmConfig.flowThreshold || 0}M`
    } else if (_alarmConfig.flowTrafficThreshold !== undefined) {
      return `${_alarmConfig.flowTrafficThreshold || 0}%`
    }
  }
  return 0
})

const getStstusColor = computed(() => {
  if (props.data.flowPercentage > 100) {
    return '#ff4d4f'
  } else if (props.data?.alarmEnable && props.data.totalFlow) {
    const _alarmConfig = props.data.alarmConfig || {}
    if (_alarmConfig.flowThreshold !== undefined) {
      if (props.data.residualFlow < _alarmConfig.flowThreshold) {
        return '#faad14'
      }
    } else if (_alarmConfig.flowTrafficThreshold !== undefined) {
      // 剩余占有率
      const residualTraffic = Math.ceil(props.data.residualFlow / props.data.totalFlow * 100)
      if (residualTraffic < _alarmConfig.flowTrafficThreshold) {
        return '#faad14'
      }
    }
  }
  return 'rgb(22, 119, 255)'
})
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
