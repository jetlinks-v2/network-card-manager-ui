<template>
  <div class="header">
    <TitleComponent data="流量使用TOP10"/>
    <a-range-picker style="min-width: 300px"/>
  </div>
  <div>
    <div v-for="item in list" :key="item.name" class="rank-item">
      <div>{{ item.name }}</div>
      <a-progress
          :strokeColor="'#ADC6FF'"
          :trailColor="'#E0E4E8'"
          :strokeLinecap="'butt'"
          :showInfo="false"
          :percent="Math.ceil((item.value / topTotal) * 100)"
      />
      <div>{{ item.value }}M</div>
    </div>
  </div>
</template>

<script setup>
const list = new Array(10).fill(0).map((item, index) => {
  return {
    value: Math.floor(Math.random() * 100),
    name: Math.floor(Math.random() * 1000000000),
  };
});
const topTotal = 100
</script>

<style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
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
