<template>
  <section class="sim-location">
    <header>
      <div>
        <h3>{{ t('Detail.index.427958-30') }}</h3>
        <small>{{ t('Detail.index.427958-31') }}</small>
      </div>
      <a-button
        :loading="loading"
        @click="locate"
      >
        <template #icon><AIcon type="WifiOutlined" /></template>
        {{ t('Detail.index.427958-28') }}
      </a-button>
    </header>
    <DetailLoadError
      v-if="failed"
      :message="t('RealtimePositioning.index.390590-14')"
      :retry="false"
    />
    <a-button
      v-if="failed && historySupported"
      type="link"
      @click="history"
    >
      {{ t('SimDetail.retryHistory') }}
    </a-button>
    <div class="sim-location__status" role="status">
      <a-spin v-if="loading" size="small" />
      <span v-if="marks?.length">{{ marks[0].location || `${marks[0].longitude}, ${marks[0].latitude}` }}</span>
      <span v-else-if="!loading && !failed">{{ t('SimDetail.noLocation') }}</span>
    </div>
    <div class="sim-location__map" v-if="active">
      <RealTimeMap :marks="marks" :is-show="true" />
    </div>
  </section>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import RealTimeMap from '../../RealtimePositioning/components/RealTimeMap.vue'
import DetailLoadError from './DetailLoadError.vue'
import { useCardLocation } from './useCardLocation'

const props = defineProps<{ id: string; active: boolean; historySupported: boolean }>()
const { t } = useI18n()
const {
  position: { data: marks, loading, failed },
  history,
  locate
} = useCardLocation(props.id, props.historySupported)
</script>
<style scoped>
.sim-location {
  padding: var(--space-5);
}
.sim-location header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}
.sim-location h3 {
  font-size: var(--fs-16);
  margin: 0;
}
.sim-location small {
  color: var(--jet-theme-text-secondary);
}
.sim-location__status {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-height: 1.5em;
  margin-bottom: var(--space-2);
  color: var(--jet-theme-text-secondary);
}
.sim-location__map {
  height: clamp(18rem, 50vh, 32rem);
}
</style>
