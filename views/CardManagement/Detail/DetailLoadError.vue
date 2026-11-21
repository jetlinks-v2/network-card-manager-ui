<template>
  <a-alert
    type="error"
    show-icon
    :message="message || $t('SimDetail.loadFailed')"
  >
    <template
      v-if="retry"
      #action
    >
      <a-button
        size="small"
        @click="$emit('retry')"
      >
        {{ $t('SimList.retry') }}
      </a-button>
    </template>
  </a-alert>
</template>
<script setup lang="ts">
withDefaults(defineProps<{ message?: string; retry?: boolean }>(), { retry: true })
defineEmits<{ retry: [] }>()
</script>
