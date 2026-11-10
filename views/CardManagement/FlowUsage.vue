<template>
  <div class="flow-usage">
    <a-progress v-if="summary.remainingPercent !== undefined" :percent="summary.remainingPercent"
      :stroke-color="flowProgressColor(summary.remainingPercent)" :show-info="false" :stroke-width="6" />
    <small class="flow-usage__summary">
      <span>{{ t('SimList.remaining') }} {{ formatCardFlow(summary.residual) }}/{{ formatCardFlow(summary.total) }}</span>
      <span class="flow-usage__used">{{ t('SimList.used') }} {{ formatCardFlow(summary.used) }}</span>
    </small>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import { cardFlowSummary, formatCardFlow, flowProgressColor, type CardFlow } from './flow'
const props = defineProps({ card: { type: Object as PropType<CardFlow>, required: true } })
const { t } = useI18n()
const summary = computed(() => cardFlowSummary(props.card))
</script>

<style scoped>
.flow-usage { min-width: 15rem; width: 100%; }
.flow-usage__summary { display: flex; flex-wrap: wrap; justify-content: space-between; gap: var(--space-2); color: var(--ink-3); font-weight: normal; }
:deep(.ant-progress) { display: block; margin: 0; line-height: 1; }
</style>
