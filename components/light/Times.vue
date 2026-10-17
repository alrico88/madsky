<template lang="pug">
h4.text-muted Horario solar:
.font-mono.flex.gap-3
  div #[icon(name="tabler:sunrise")] {{ timeFormatter.format(solarTimes.sunrise) }}
  div #[icon(name="tabler:sunset")] {{ timeFormatter.format(solarTimes.sunset) }}
</template>

<script setup lang="ts">
import suncalc from "suncalc";
const { getTimes } = suncalc;

const props = defineProps<{
  date: string;
}>();

const config = useRuntimeConfig();
const timeFormatter = new Intl.DateTimeFormat("es-ES", {
  timeZone: "Europe/Madrid",
  hour: "2-digit",
  minute: "2-digit",
});

const solarTimes = computed(() => {
  const [lat, lon] = config.public.measurementsLocation;

  return getTimes(new Date(props.date), lat as number, lon as number);
});
</script>
