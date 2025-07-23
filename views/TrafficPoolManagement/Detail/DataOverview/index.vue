<template>
  <div class="data-view-box">
    <div class="data-view-item">
      <Overview />
    </div>
    <div class="data-view-item">
      <Alarm />
    </div>
    <div class="data-view-item" style="height: 420px">
      <FlowRate />
    </div>
    <div class="data-view-item" style="height: 420px">
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
  gap: 22px;

  .data-view-item {
    border: 1px solid #B9B9B9;
    padding: 16px;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    height: 348px;
  }

  :deep(.title) {
    margin-bottom: 0;
  }
}
</style>
