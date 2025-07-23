<!-- 物联卡查看 -->
<template>
  <j-page-container v-if="type === 'card'">
    <!-- 新增 -->
    <FullPage :fixed="false" style="background: transparent">
      <Content :type="type"/>
    </FullPage>
  </j-page-container>
  <div v-else>
    <Content :type="type"/>
  </div>
</template>

<script setup name="CardDetail">
import Content from './Content.vue'

const props = defineProps({
  type: {
    type: String,
    default: "card",
  },
});
</script>
<style scoped lang="less">

</style>
