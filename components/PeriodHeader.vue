<template lang="pug">
page-header(
  :title="period",
  navigation,
  :previous="previous",
  :next="next",
  :pending="pending"
)
</template>

<script setup lang="ts">
const props = defineProps<{
  start?: string;
  end?: string;
  page: number;
  pending?: boolean;
  hasNext?: boolean;
}>();

const route = useRoute();
const formatter = new Intl.DateTimeFormat("es-ES", {
  timeZone: "Europe/Madrid",
  day: "2-digit",
  month: "short",
  year: "numeric",
});
const period = computed(() => {
  if (props.pending) return "Cargando período…";
  if (!props.start || !props.end)
    return props.pending ? "Cargando…" : "Sin mediciones";
  return `Del ${formatter.format(new Date(props.start))} al ${formatter.format(new Date(props.end))}`;
});

const previous = computed(() =>
  props.page > 0
    ? { path: route.path, query: { ...route.query, page: props.page - 1 } }
    : undefined
);
const next = computed(() =>
  props.hasNext
    ? { path: route.path, query: { ...route.query, page: props.page + 1 } }
    : undefined
);
</script>
