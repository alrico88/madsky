<template lang="pug">
nav-bar
page-header(
  :title="String(calendarYear)",
  subtitle="Color medio diurno por día",
  navigation,
  :pending="pending",
  :previous="data?.minYear && calendarYear > data.minYear ? { path: '/year', query: { year: calendarYear - 1 } } : undefined",
  :next="data?.maxYear && calendarYear < data.maxYear ? { path: '/year', query: { year: calendarYear + 1 } } : undefined"
)
main.year-page.mx-auto.max-w-6xl.px-4.pb-4
  year-calendar-skeleton(v-if="pending")
  u-alert(
    v-else-if="error",
    title="No se pudo cargar el calendario",
    color="error",
    icon="i-tabler-alert-circle"
  )
    template(#actions)
      u-button(color="error", variant="outline", @click="refresh()") Reintentar
  template(v-else-if="data")
    year-calendar(:year="data.year", :days="data.days")
    p.empty-message(v-if="!measuredDayCount && data.minYear") No hay mediciones diurnas para {{ data.year }}.
    p.empty-message(v-else-if="!data.minYear") Todavía no hay mediciones guardadas.
</template>

<script setup lang="ts">
import YearCalendar from "~/components/year/YearCalendar.vue";

const route = useRoute();
const requestedYear = computed(() =>
  typeof route.query.year === "string" ? route.query.year : undefined
);

const { data, pending, error, refresh } = await useLazyFetch(
  "/api/measurements/year",
  {
    query: { year: requestedYear },
    watch: [requestedYear],
  }
);

const calendarYear = computed(() => {
  if (data.value?.year) return data.value.year;
  const parsed = Number(requestedYear.value);
  return Number.isInteger(parsed) ? parsed : new Date().getFullYear();
});
const measuredDayCount = computed(
  () => data.value?.days.filter((day) => day.count > 0).length ?? 0
);

useSeoMeta({
  title: "Calendario anual del cielo · MADSKY",
  description:
    "Explora el color medio del cielo de Madrid día a día durante todo el año.",
});
</script>

<style lang="scss" scoped>
.year-page {
  color: #0f172a;
}

.empty-message {
  margin: 2rem 0;
  color: var(--ui-text-muted);
  font-size: 0.9rem;
  text-align: center;
}
</style>
