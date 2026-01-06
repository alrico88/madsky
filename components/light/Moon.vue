<template lang="pug">
h4.text-slate-500 Superficie iluminada de la luna:
.data.font-mono {{ moonIllumination }}%
</template>

<script setup lang="ts">
import { processNumber } from "number-helper-functions";
import suncalc from "suncalc";
const { getMoonIllumination } = suncalc;

const props = defineProps<{
  date: string;
}>();

const moonIllumination = computed(() =>
  processNumber(getMoonIllumination(new Date(props.date)).fraction * 100)
);
</script>
