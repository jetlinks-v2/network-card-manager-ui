<template>
  <div class="data-view-box">
    <div class="data-view-item">
      <Overview />
    </div>
    <div class="data-view-item">
      <Alarm />
    </div>
    <div class="data-view-item">
      <FlowRate />
    </div>
    <div class="data-view-item">
      <Ranking />
    </div>
  </div>
</template>

<script setup>
import Overview from './Overview.vue'
import Alarm from './Alarm.vue'
import Ranking from './Ranking.vue'
import FlowRate from './FlowRate.vue'
</script>

<style lang="less" scoped>
.data-view-box {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;

  :deep(.title) {
    margin-bottom: 0;
  }
}
</style>
