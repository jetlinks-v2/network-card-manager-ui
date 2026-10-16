<template>
  <j-page-container>
    <FullPage>
      <EqualHeightColumns
          :left-width="400"
          :gap="24"
      >
        <template #left>
          <LeftList @change="onChange"/>
        </template>
        <template #right>
          <RightGeo :cardIds="cardIds"/>
        </template>
      </EqualHeightColumns>
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

</style>
