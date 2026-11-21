<template>
  <div class="sim-overview">
    <div class="sim-overview__column">
      <section
        v-for="group in groups"
        :key="group.title"
      >
        <h3>{{ group.title }}</h3>
        <dl class="sim-fields">
          <div
            v-for="field in group.fields"
            :key="field.label"
            :class="{ 'sim-fields__wide': field.wide }"
          >
            <dt>{{ field.label }}</dt>
            <dd>
              <a-button
                v-if="field.link"
                class="sim-overview__link"
                type="link"
                @click="$emit('relation', field.link)"
              >
                {{ field.value }}
              </a-button>
              <template v-else>{{ field.value || t('comm.table.empty') }}</template>
            </dd>
          </div>
        </dl>
      </section>
    </div>
    <div class="sim-overview__column">
      <section>
        <header>
          <h3>{{ t('SimDetail.planFlow') }}</h3>
          <a-button
            type="link"
            @click="$emit('statistics')"
          >
            {{ t('SimDetail.viewStats') }} →
          </a-button>
        </header>
        <small>{{ t(flow.pool ? 'SimDetail.poolRemaining' : 'Detail.index.427958-12') }}</small>
        <strong class="sim-overview__amount">{{ formatCardFlow(flow.residual, t('comm.table.empty-2')) }}</strong>
        <a-progress
          v-if="flow.usedPercent !== undefined"
          :percent="Math.min(100, flow.usedPercent)"
          :show-info="false"
          :stroke-width="6"
        />
        <div class="sim-overview__usage">
          <span>
            {{ t(flow.pool ? 'SimDetail.cardUsed' : 'SimList.used') }} {{ formatCardFlow(flow.used, t('comm.table.empty-2')) }}
            <template v-if="flow.usedPercent !== undefined">· {{ Number(flow.usedPercent.toFixed(1)) }}%</template>
          </span>
          <span>
            {{ t(flow.pool ? 'SimDetail.poolTotal' : 'Detail.index.427958-10') }} {{ formatCardFlow(flow.total, t('comm.table.empty-2')) }}
          </span>
        </div>
      </section>
      <section>
        <header>
          <h3>{{ t('SimDetail.status') }}</h3>
          <a-button
            type="link"
            @click="$emit('records')"
          >
            {{ t('Detail.index.427958-29') }} →
          </a-button>
        </header>
        <dl class="sim-states">
          <div
            v-for="item in states"
            :key="item.label"
          >
            <dt>{{ item.label }}</dt>
            <dd>
              <StatusTag
                :status="item.tone"
                :text="item.text || t('comm.table.empty-2')"
              />
              <small
                v-if="item.reason"
                class="sim-states__reason"
              >
                {{ item.reason }}
              </small>
            </dd>
          </div>
        </dl>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import StatusTag from '@jetlinks-web-core/components/StatusTag/index.vue'
import type { CardDetail } from '../../../api/cardDetail.types'
import { platformTypeList } from '../../data'
import { formatCardFlow } from '../flow'
import { detailFlow } from './detailFlow'
import { stateTone } from './cardState'

interface Field {
  label: string
  value?: string
  wide?: boolean
  link?: 'device' | 'pool'
}
const props = defineProps<{ card: CardDetail; stopReason?: string }>()
defineEmits<{ relation: [kind: 'device' | 'pool']; statistics: []; records: [] }>()
const { t } = useI18n()
const flow = computed(() => detailFlow(props.card))
function timestamp(value?: number | string) {
  return value != null && value !== '' && dayjs(value).isValid()
    ? dayjs(value).format('YYYY-MM-DD HH:mm:ss')
    : undefined
}
const groups = computed<Array<{ title: string; fields: Field[] }>>(() => {
  const c = props.card
  return [
    {
      title: t('SimDetail.access'),
      fields: [
        { label: 'ICCID', value: c.iccId, wide: true },
        {
          label: t('Detail.index.427958-4'),
          value:
            c.platformType?.text || platformTypeList.find((p) => p.value === c.operatorName)?.label || c.operatorName
        },
        { label: t('Detail.index.427958-5'), value: c.platformConfigName },
        {
          label: t('Detail.index.427958-3'),
          value: c.deviceName || c.deviceId,
          link: c.deviceId ? 'device' : undefined
        },
        {
          label: t('Detail.index.427958-32'),
          value: c.poolAlias || c.poolName || c.poolId,
          link: c.poolId ? 'pool' : undefined
        }
      ]
    },
    {
      title: t('SimDetail.usageInfo'),
      fields: [
        { label: t('Detail.index.427958-8'), value: timestamp(c.activationDate) ?? t('comm.table.empty-2') },
        { label: t('Detail.index.427958-9'), value: timestamp(c.updateTime) ?? t('comm.table.empty-2') },
        { label: t('Detail.index.427958-15'), value: c.describe, wide: true }
      ]
    }
  ]
})
const states = computed(() => {
  const c = props.card
  return [
    {
      label: t('Detail.index.427958-14'),
      text: c.cardStateType?.text,
      tone: stateTone(c.cardStateType?.value),
      reason: props.stopReason
    },
    {
      label: t('Detail.index.427958-25'),
      text: c.syncCardStatus?.text,
      tone: stateTone(c.syncCardStatus?.value),
      reason: c.syncCardStatus?.value === 'failed' ? c.errorMessage : undefined
    },
    {
      label: t('Detail.index.427958-27'),
      text: t(`CardManagement.index.427944-${c.flowError === true ? 19 : c.flowError === false ? 50 : 18}`),
      tone: stateTone(c.flowError === true ? 'failed' : c.flowError === false ? 'success' : undefined),
      reason: c.flowError ? c.flowErrorMessage : undefined
    }
  ]
})
</script>

<style scoped>
.sim-overview {
  display: grid;
  flex: 1 0 auto;
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
  gap: var(--space-6);
}
.sim-overview__column {
  min-width: 0;
}
.sim-overview__column + .sim-overview__column {
  padding-inline-start: var(--space-6);
  border-inline-start: 1px solid var(--jet-theme-border);
}
.sim-overview section + section {
  margin-block-start: var(--space-5);
  padding-block-start: var(--space-4);
  border-top: 1px solid var(--jet-theme-border);
}
.sim-overview h3 {
  margin: 0;
  font-size: var(--fs-16);
}
.sim-overview header,
.sim-states > div,
.sim-overview__usage {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-2);
}
.sim-overview dl {
  margin: var(--space-4) 0 0;
}
.sim-overview dt,
.sim-overview small,
.sim-overview__usage {
  color: var(--jet-theme-text-secondary);
}
.sim-overview dd {
  margin: 0;
  overflow-wrap: anywhere;
}
.sim-fields,
.sim-states {
  display: grid;
  gap: var(--space-3);
}
.sim-fields {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.sim-fields__wide {
  grid-column: 1 / -1;
}
.sim-overview button.ant-btn-link {
  padding: 0;
  height: auto;
  white-space: normal;
  text-align: start;
}
.sim-overview__amount {
  display: block;
  font-size: var(--fs-28, 1.75rem);
  font-variant-numeric: tabular-nums;
}
.sim-overview header {
  margin-bottom: var(--space-3);
}
.sim-states dd {
  text-align: end;
  max-width: 100%;
}
.sim-states .sim-states__reason {
  display: block;
  color: var(--jet-theme-error, var(--danger));
}
@container (max-width: 700px) {
  .sim-overview {
    grid-template-columns: 1fr;
    align-content: start;
  }
  .sim-overview__column + .sim-overview__column {
    padding-inline-start: 0;
    border-inline-start: 0;
    padding-block-start: var(--space-4);
    border-top: 1px solid var(--jet-theme-border);
  }
}
@media (max-width: 700px) {
  .sim-overview {
    grid-template-columns: 1fr;
    align-content: start;
  }
  .sim-overview__column + .sim-overview__column {
    padding-inline-start: 0;
    border-inline-start: 0;
  }
}
</style>
