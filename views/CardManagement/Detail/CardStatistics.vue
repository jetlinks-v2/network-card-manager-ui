<template>
  <section class="sim-statistics">
    <h3>{{ t('Detail.index.427958-17') }}</h3>
    <DetailLoadError
      v-if="totals.failed.value"
      @retry="loadTotals"
    />
    <a-skeleton
      v-else-if="totals.loading.value"
      active
      :paragraph="{ rows: 1 }"
    />
    <dl
      v-else
      class="sim-statistics__totals"
    >
      <div
        v-for="(group, i) in groups"
        :key="group"
      >
        <dt>{{ t(`Detail.index.427958-${18 + i}`) }}</dt>
        <dd>{{ formatCardFlow(totals.data.value?.[i], t('comm.table.empty-2')) }}</dd>
      </div>
    </dl>
    <header>
      <h3>{{ t('Detail.index.427958-16') }}</h3>
      <div class="sim-statistics__filter">
        <TimeSelect
          type="week"
          :is-timer="false"
          :is-show-time="false"
          :quick-btn-list="periods"
          @change="changeRange"
        />
      </div>
    </header>
    <DetailLoadError
      v-if="trend.failed.value"
      @retry="loadTrend()"
    />
    <a-skeleton
      v-else-if="trend.loading.value"
      active
    />
    <div
      v-else-if="trend.data.value?.some((point) => point.value !== null)"
      class="sim-statistics__chart"
    >
      <Echarts :option="option" />
    </div>
    <j-empty v-else />
  </section>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Echarts from '@jetlinks-web-core/components/Echarts/Echarts.vue'
import TimeSelect from '../../components/TimeSelect.vue'
import { formatCardFlow } from '../flow'
import DetailLoadError from './DetailLoadError.vue'
import { groups } from './detailFlow'
import { useCardStatistics } from './useCardStatistics'

const props = defineProps<{ id: string }>()
const { t } = useI18n()
const { totals, trend, loadTotals, loadTrend } = useCardStatistics(props.id, t)
const periods = computed(() =>
  ['yesterday', 'week', 'month', 'year'].map((value, i) => ({ value, label: t(`Detail.index.427958-${21 + i}`) }))
)
function changeRange(range: Record<string, unknown>) {
  if (typeof range.start === 'number' && typeof range.end === 'number')
    void loadTrend({
      start: range.start,
      end: range.end,
      type: typeof range.type === 'string' ? range.type : undefined
    })
}
const option = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { containLabel: true, left: 12, right: 16, bottom: 12, top: 32 },
  xAxis: { type: 'category', boundaryGap: false, data: trend.data.value?.map((p) => p.time) },
  yAxis: { type: 'value', name: 'MB' },
  series: [
    { type: 'line', name: t('Detail.index.427958-11'), showSymbol: false, data: trend.data.value?.map((p) => p.value) }
  ]
}))
</script>
<style scoped>
.sim-statistics {
  padding: var(--space-5);
}
.sim-statistics h3 {
  margin: 0;
  font-size: var(--fs-16);
}
.sim-statistics__totals {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 10rem), 1fr));
  gap: var(--space-4);
  margin: var(--space-4) 0;
}
.sim-statistics__totals dt {
  color: var(--jet-theme-text-secondary);
}
.sim-statistics__totals dd {
  margin: 0;
  font-size: var(--fs-20);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.sim-statistics header {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--jet-theme-border);
  margin: var(--space-4) 0;
  padding-top: var(--space-4);
}
.sim-statistics__filter {
  width: min(100%, 22rem);
  min-width: 0;
}
.sim-statistics__chart {
  height: clamp(16rem, 37vh, 26rem);
}
</style>
