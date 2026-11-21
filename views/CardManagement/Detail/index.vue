<template>
  <!-- The route may reuse this component for another card; its complete request/UI scope must not be reused. -->
  <CardDetailPage
    v-if="type === 'card' && cardId"
    :key="cardId"
    :id="cardId"
  />
  <j-empty v-else-if="type === 'card'" />
  <Content
    v-else
    :type="type"
  />
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import CardDetailPage from './CardDetailPage.vue'

defineOptions({ name: 'CardDetail' })
withDefaults(defineProps<{ type?: string }>(), { type: 'card' })
const Content = defineAsyncComponent(() => import('./Content.vue'))
const route = useRoute()
const cardId = computed(() => (typeof route.params.id === 'string' ? route.params.id : ''))
</script>
