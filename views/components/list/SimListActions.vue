<template>
  <TableActions>
    <TableActionsItem v-for="action in actions" :key="action.key" :common="action.key === 'update'">
      <j-permission-button
        type="link" :disabled="action.disabled" :danger="action.key === 'delete'"
        :hasPermission="action.key === 'view' ? true : `${permission}:${action.key}`"
        :aria-label="action.text"
        :tooltip="action.tooltip" :popConfirm="action.popConfirm" @click="action.onClick?.()"
      >
        <span v-if="iconOnly && action.key === 'update'" role="img" :aria-label="action.text">
          <AIcon :type="action.icon || 'EditOutlined'" />
        </span>
        <template v-else>{{ action.text }}</template>
      </j-permission-button>
    </TableActionsItem>
  </TableActions>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { RowAction } from './types'
defineProps({
  actions: { type: Array as PropType<RowAction[]>, default: () => [] },
  permission: { type: String, required: true },
  iconOnly: { type: Boolean, default: false },
})
</script>
