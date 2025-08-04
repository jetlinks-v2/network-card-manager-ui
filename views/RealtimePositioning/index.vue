<template>
  <j-page-container>
    <FullPage>
      <div class="realtime-position-container">
        <div class="realtime-position-container-left">
          <LeftList @change="onChange"/>
        </div>
        <div class="realtime-position-container-right">
          <RightGeo :cardIds="cardIds"/>
        </div>
      </div>
    </FullPage>
  </j-page-container>
</template>

<script setup>
import LeftList from './LeftList.vue';
import RightGeo from './RightGeo.vue';

const cardIds = ref([])
const loadings = ref({})

provide('loadings', loadings)
const onChange = (_item) => {
  cardIds.value = _item
  // 清空传过去的数据，防止客户一直点击同一个数据，不触发watch去重新查询数据
  setTimeout(() => {
    cardIds.value = []
  }, 1000)
}
</script>

<style lang="less" scoped>
.realtime-position-container {
  height: 100%;
  display: flex;
  gap: 24px;
  padding: 24px;

  &-left {
    height: 100%;
    width: 400px;
  }

  &-right {
    height: 100%;
    min-width: 0;
    flex: 1
  }
}
</style>
