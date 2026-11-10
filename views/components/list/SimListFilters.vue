<template>
  <div class="sim-list-filters">
    <div class="sim-list-filters__search">
      <slot name="search">
        <div class="sim-list-filters__input">
          <AIcon type="FilterOutlined" class="sim-list-filters__icon" />
          <ConditionFilter :columns="columns" :placeholder="placeholder" @search="emit('search', $event)" />
        </div>
      </slot>
    </div>
    <SwitchGroup :model-value="status.value" :options="status.options" :aria-label="status.label" @change="emit('status', $event)">
      <template #option="{ option }">
        <a-badge v-if="option.value !== 'all'" :status="tones[String(option.value)] || 'default'" />
        <span>{{ option.label }}</span>
      </template>
    </SwitchGroup>
    <a-alert v-if="error" type="error" show-icon class="sim-list-filters__error" :message="t('SimList.loadFailed')">
      <template #action><a-button size="small" @click="emit('retry')">{{ t('SimList.retry') }}</a-button></template>
    </a-alert>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import type { SwitchGroupOption } from '@jetlinks-web-core/components/SwitchGroup'
import type { ListQuery } from './types'
defineProps({
  columns: { type: Array, required: true },
  status: { type: Object as PropType<{ value: string; options: SwitchGroupOption[]; label: string }>, required: true },
  error: { type: Boolean, default: false },
  placeholder: { type: String, default: '' },
})
const { t } = useI18n()
const emit = defineEmits<{ (event: 'search', query: ListQuery): void; (event: 'status', value: string | number): void; (event: 'retry'): void }>()
const tones: Record<string, 'success' | 'error' | 'default'> = { success: 'success', failed: 'error', enabled: 'success', disabled: 'default' }
</script>

<style scoped>
.sim-list-filters { display: flex; align-items: center; gap: var(--space-3); flex-wrap: wrap; min-width: 0; width: 100%; }
.sim-list-filters__search { flex: 1; min-width: 12rem; }
.sim-list-filters__input { display: flex; align-items: center; border: 1px solid var(--line); border-radius: var(--r-2); background: var(--bg); }
.sim-list-filters__input:focus-within { border-color: var(--accent); }
.sim-list-filters__icon { margin-left: var(--space-3); color: var(--ink-3); }
.sim-list-filters__error { width: 100%; }
:deep(.condition-filter__shell) { border: 0; background: transparent; }
:deep(.condition-filter__tail-prefix) { display: none; }
:deep(.condition-filter__action--search) { color: var(--accent); }
:deep(.switch-group) { flex-shrink: 0; gap: 0; padding: 0; overflow: hidden; background: var(--bg); border-radius: var(--r-2); }
:deep(.switch-group__item) { height: 32px; padding: 0 var(--space-4); border-radius: 0; border-inline-start: 1px solid var(--line); }
:deep(.switch-group__item:first-child) { border-inline-start: 0; }
:deep(.switch-group__item.is-selected) { color: var(--accent-ink); background: var(--accent); border-radius: 0; }
:deep(.switch-group__count) { font-size: inherit; opacity: 1; }
</style>
