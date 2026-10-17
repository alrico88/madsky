<template lang="pug">
u-badge.fixed.shadow-sm.pointer-events-none.z-50(
  color="neutral",
  variant="solid",
  size="xl",
  v-if="text && show",
  class="right-[10px] top-[50vh] -translate-y-1/2"
) {{ text }}
</template>

<script setup lang="ts">
defineProps<{
  text?: string | null;
  show: boolean;
}>();
</script>
