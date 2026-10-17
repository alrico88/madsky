<template lang="pug">
nav-bar
page-header(
  :title="dateTitle",
  navigation,
  :pending="pending",
  :previous="{ path: `/day/${previousDate}` }",
  :next="{ path: `/day/${nextDate}` }"
)
  template(#actions)
    u-button(to="/year", color="neutral", variant="outline") Ver el año
main.day-page.mx-auto.max-w-5xl.px-4.pb-4
  u-alert(
    v-if="pending",
    role="status",
    title="Cargando las muestras del día…",
    color="neutral",
    icon="i-lucide-loader-circle",
    :ui="{ icon: 'animate-spin motion-reduce:animate-none' }"
  )
  u-alert(
    v-else-if="error",
    title="No se pudieron cargar las muestras de este día",
    color="error",
    icon="i-tabler-alert-circle"
  )
    template(#actions)
      u-button(color="error", variant="outline", @click="refresh()") Reintentar
  u-alert(
    v-else-if="measurements.length === 0",
    title="Sin mediciones para este día",
    :description="`No hay muestras guardadas para ${dateTitle}.`",
    color="neutral",
    icon="i-tabler-calendar-off"
  )
    template(#actions)
      u-button(to="/days", color="neutral", variant="outline") Explorar otros días
  template(v-else-if="currentMeasurement")
    playback-stage(:measurement="currentMeasurement")
    playback-controls(
      :sample-count="measurements.length",
      :measurements="measurements",
      :index="playback.index.value",
      :speed="playback.speed.value",
      :is-playing="playback.isPlaying.value",
      :current-time="currentTime",
      :spacing-text="spacingText",
      @play="playback.play",
      @pause="playback.pause",
      @seek="playback.seek",
      @speed-change="playback.setSpeed"
    )
    day-context-bands(
      :date="dateKey",
      :measurements="measurements",
      :index="playback.index.value"
    )
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import PlaybackControls from "../../components/day/PlaybackControls.vue";
import PlaybackStage from "../../components/day/PlaybackStage.vue";
import { useDayPlayback } from "../../composables/useDayPlayback";

definePageMeta({
  validate: ({ params }) => {
    const value = String(params.date ?? "");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00Z`);
    return (
      !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value
    );
  },
});

interface DayMeasurement {
  id: number;
  createdAt: string;
  averageColor: string;
  weather: {
    temperature: number;
    feelsLike: number;
    weatherCode: number;
    cloudCover: number;
    rain: number;
  } | null;
}

const route = useRoute();
const dateKey = computed(() => String(route.params.date ?? ""));
const { data, pending, error, refresh } = await useFetch<{
  date: string;
  measurements: DayMeasurement[];
}>("/api/measurements/day", {
  query: { date: dateKey },
  watch: [dateKey],
  default: () => ({ date: dateKey.value, measurements: [] }),
});

const measurements = computed(() => data.value?.measurements ?? []);
const count = computed(() => measurements.value.length);
const playback = useDayPlayback(count);
const currentMeasurement = computed(
  () => measurements.value[playback.index.value] ?? null
);

watch(dateKey, () => {
  playback.pause();
  playback.seek(0);
});
onBeforeRouteLeave(() => playback.pause());
onBeforeUnmount(() => playback.pause());

const dateTitle = computed(() => {
  if (!isValidDateKey(dateKey.value)) return "Fecha inválida";
  return new Intl.DateTimeFormat("es-ES", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${dateKey.value}T12:00:00Z`));
});

const previousDate = computed(() => addClientDays(dateKey.value, -1));
const nextDate = computed(() => addClientDays(dateKey.value, 1));
const currentTime = computed(() => {
  if (!currentMeasurement.value) return "";
  return new Intl.DateTimeFormat("es-ES", {
    timeZone: "Europe/Madrid",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).format(new Date(currentMeasurement.value.createdAt));
});

const spacingText = computed(() => {
  if (measurements.value.length < 2) {
    return "Solo hay una muestra registrada para este día.";
  }

  const gaps = measurements.value
    .slice(1)
    .map((measurement, index) =>
      Math.round(
        (new Date(measurement.createdAt).getTime() -
          new Date(measurements.value[index].createdAt).getTime()) /
          60_000
      )
    );
  const uniform = new Set(gaps).size === 1;
  return uniform
    ? `Avanza entre ${gaps[0]} min por muestra. Se muestran solo mediciones registradas.`
    : "Los intervalos entre muestras cambian. Se muestran solo mediciones registradas.";
});

function isValidDateKey(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return (
    !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value
  );
}

function addClientDays(value: string, amount: number): string {
  if (!isValidDateKey(value)) return "";
  const date = new Date(`${value}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}

useSeoMeta({
  title: () => `${dateTitle.value} · Colores del cielo · MADSKY`,
  description: () =>
    `Reproduce las muestras reales del cielo de Madrid del ${dateTitle.value}.`,
});
</script>

<style lang="scss" scoped>
.day-page {
  color: #0f172a;
}
</style>
