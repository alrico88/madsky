<template lang="pug">
u-page-header(
  :title="title",
  :as="{ root: 'header' }",
  :ui="{ root: 'border-0 p-4', wrapper: 'flex-row flex-wrap items-center gap-4 justify-between', title: 'flex flex-wrap items-baseline gap-x-3 gap-y-1 text-base sm:text-base font-medium text-default', links: 'gap-3' }"
)
  template(v-if="subtitle", #title)
    span {{ title }}
    span.text-sm.font-normal.text-muted {{ subtitle }}
  template(v-if="navigation || $slots.actions", #links)
    slot(name="actions")
    nav.flex.gap-2(v-if="navigation", aria-label="Navegar por períodos")
      u-button(
        color="neutral",
        variant="outline",
        icon="i-tabler-arrow-left",
        :to="previous",
        :disabled="!previous || pending"
      ) Anterior
      u-button(
        color="neutral",
        variant="outline",
        trailing-icon="i-tabler-arrow-right",
        :to="next",
        :disabled="!next || pending"
      ) Siguiente
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";

defineProps<{
  title: string;
  subtitle?: string;
  navigation?: boolean;
  previous?: RouteLocationRaw;
  next?: RouteLocationRaw;
  pending?: boolean;
}>();
</script>
