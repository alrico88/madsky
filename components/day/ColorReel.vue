<template lang="pug">
.color-reel
  u-slider.reel-strip(
    :min="0",
    :max="Math.max(0, measurements.length - 1)",
    :model-value="index",
    :disabled="measurements.length < 2",
    :style="{ backgroundImage: background }",
    :ui="{ track: 'h-12 bg-transparent rounded-md', range: 'hidden', thumb: 'h-12 w-1 rounded-sm ring-1 ring-inverted bg-default' }",
    aria-label="Explorar los colores del día",
    :aria-valuetext="times[index]",
    @update:model-value="onSeek"
  )
  .reel-times(aria-hidden="true")
    span {{ times[0] }}
    span {{ times.at(-1) }}
</template>

<script setup lang="ts">
const props = defineProps<{
  measurements: { createdAt: string; averageColor: string }[];
  index: number;
}>();
const emit = defineEmits<{ seek: [index: number] }>();
const timeFormatter = new Intl.DateTimeFormat("es-ES", {
  timeZone: "Europe/Madrid",
  hour: "2-digit",
  minute: "2-digit",
});
const times = computed(() =>
  props.measurements.map((sample) =>
    timeFormatter.format(new Date(sample.createdAt))
  )
);
const background = computed(() => {
  const count = props.measurements.length;
  if (!count) return "none";
  const stops = props.measurements.map(
    (sample, index) =>
      `${sample.averageColor} ${(index / count) * 100}% ${((index + 1) / count) * 100}%`
  );
  return `linear-gradient(to right, ${stops.join(", ")})`;
});
function onSeek(value: number | number[] | undefined) {
  if (typeof value === "number") emit("seek", value);
}
</script>

<style lang="scss" scoped>
.color-reel {
  display: grid;
  gap: 0.35rem;
}
.reel-strip {
  width: 100%;
  border: 1px solid var(--ui-border);
  border-radius: 0.4rem;
}
.reel-times {
  display: flex;
  justify-content: space-between;
  color: var(--ui-text-muted);
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
}
</style>
