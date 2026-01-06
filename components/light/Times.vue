<template lang="pug">
h4.text-slate-500 Horario solar:
.font-mono.flex.gap-3
  div #[icon(name="tabler:sunrise")] {{ dayjs(solarTimes.sunrise).format("HH:mm") }}
  div #[icon(name="tabler:sunset")] {{ dayjs(solarTimes.sunset).format("HH:mm") }}
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import suncalc from "suncalc";
const { getTimes } = suncalc;

const props = defineProps<{
  date: string;
}>();

const config = useRuntimeConfig();

const solarTimes = computed(() => {
  const [lat, lon] = config.public.measurementsLocation;

  return getTimes(dayjs(props.date).toDate(), lat as number, lon as number);
});
</script>
