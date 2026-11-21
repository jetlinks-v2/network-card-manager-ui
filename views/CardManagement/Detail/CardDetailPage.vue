<template>
  <PageChrome>
    <PageBack
      :label="t('SimDetail.back')"
      @back="back"
    />
  </PageChrome>
  <template v-if="detail">
    <PageChrome flush>
      <ContentPanel
        class="sim-detail-summary"
        fill
      >
        <DetailHeader
          variant="summary"
          :title="detail.name || detail.id"
        >
          <template #icon><AIcon type="CreditCardOutlined" /></template>
          <template #titleExtra>
            <StatusTag
              :status="stateTone(detail.cardState?.value)"
              :text="detail.cardState?.text || t('comm.table.empty-2')"
            />
          </template>
          <template #meta>
            <DetailMetaItem
              kind="id"
              merged-tooltip
              label="ID"
              :value="detail.id"
            />
            <DetailMetaItem
              kind="brand"
              merged-tooltip
              :label="t('Detail.index.427958-6')"
              :value="operator"
            />
            <DetailMetaItem
              kind="category"
              merged-tooltip
              :label="t('SimDetail.planType')"
              :value="detail.comboType?.text || t('comm.table.empty-2')"
            />
          </template>
          <template #actions>
            <j-permission-button
              hasPermission="iot-card/CardManagement:update"
              @click="editing = true"
            >
              <template #icon><AIcon type="EditOutlined" /></template>
              {{ t('Detail.index.427958-1') }}
            </j-permission-button>
          </template>
        </DetailHeader>
      </ContentPanel>
      <SlantedTabs
        :active-key="tab"
        :options="tabs"
        @change="select"
      />
    </PageChrome>
    <DetailLoadError
      v-if="failed"
      @retry="refresh"
    />
    <div
      v-if="tab === 'overview'"
      class="sim-detail-body"
    >
      <CardOverview
        :card="detail"
        :stop-reason="stopped ? reason : undefined"
        @relation="openRelation"
        @statistics="select('statistics')"
        @records="records = true"
      />
    </div>
    <CardStatistics
      v-if="visited.has('statistics')"
      v-show="tab === 'statistics'"
      :id="id"
    />
    <CardLocation
      v-if="visited.has('location')"
      v-show="tab === 'location'"
      :id="id"
      :active="tab === 'location'"
      :key="platform"
      :history-supported="platform !== 'unicom'"
    />
    <Save
      v-if="editing"
      type="edit"
      :data="detail"
      @change="afterEdit"
    />
    <SyncRecord
      v-if="records"
      :data="detail"
      @close="records = false"
    />
  </template>
  <a-skeleton
    v-else-if="loading"
    active
  />
  <DetailLoadError
    v-else-if="failed"
    @retry="refresh"
  />
  <j-empty v-else />
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import PageBack from '@jetlinks-web-core/components/PageBack/index.vue'
import PageChrome from '@jetlinks-web-core/components/PageChrome/index.vue'
import DetailHeader from '@jetlinks-web-core/components/DetailHeader/index.vue'
import DetailMetaItem from '@jetlinks-web-core/components/DetailMetaItem'
import SlantedTabs from '@jetlinks-web-core/components/SlantedTabs'
import StatusTag from '@jetlinks-web-core/components/StatusTag/index.vue'
import { OperatorList } from '../../data'
import CardOverview from './CardOverview.vue'
import DetailLoadError from './DetailLoadError.vue'
import { useCardDetail } from './useCardDetail'
import { stateTone } from './cardState'

const CardStatistics = defineAsyncComponent(() => import('./CardStatistics.vue'))
const CardLocation = defineAsyncComponent(() => import('./CardLocation.vue'))
const Save = defineAsyncComponent(() => import('../Save.vue'))
const SyncRecord = defineAsyncComponent(() => import('./SyncRecord/index.vue'))
const props = defineProps<{ id: string }>()
const { t } = useI18n()
const {
  card: { data: detail, loading, failed },
  reason,
  stopped,
  tab,
  visited,
  select,
  editing,
  records,
  afterEdit,
  refresh,
  openRelation,
  back
} = useCardDetail(props.id)
const operator = computed(
  () => OperatorList.find((o) => o.value === detail.value?.operatorName)?.label || detail.value?.operatorName || t('comm.table.empty')
)
const platform = computed(() => detail.value?.platformType?.value || detail.value?.operatorName)
const tabs = computed(() => [
  { key: 'overview', label: t('SimDetail.overview') },
  { key: 'statistics', label: t('Detail.index.427958-16') },
  { key: 'location', label: t('Detail.index.427958-30') }
])
</script>

<style scoped>
.sim-detail-summary {
  margin-block: var(--space-4);
}
.sim-detail-body {
  container-type: inline-size;
  display: flex;
  flex: 1 0 auto;
  flex-direction: column;
}
</style>
