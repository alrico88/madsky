<template lang="pug">
h4.text-slate-500 Posición sobre la vertical:
.data.font-mono
  .flex.gap-3
    div
      icon(name="tabler:sun")
      |
      | {{ toPercent(sunAlt.altitude) }}%
    div
      icon(name="tabler:moon")
      |
      | {{ toPercent(moonAlt.altitude) }}%
</template>

<script setup lang="ts">
import suncalc from "suncalc";
import { processNumber } from "number-helper-functions";

const { getPosition, getMoonPosition } = suncalc;

const props = defineProps<{
  date: string;
}>();

const [lat, lon] = useRuntimeConfig().public.measurementsLocation;

function toPercent(val: number): number {
  return processNumber((val * 100) / Math.PI);
}

const sunAlt = computed(() => getPosition(new Date(props.date), lat, lon));
const moonAlt = computed(() => getMoonPosition(new Date(props.date), lat, lon));
</script>
