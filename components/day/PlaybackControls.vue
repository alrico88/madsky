<template lang="pug">
section.controls(aria-label="Controles de reproducción")
  .control-row
    u-button(
      color="neutral",
      variant="outline",
      :icon="props.isPlaying ? 'i-tabler-player-pause' : 'i-tabler-player-play'",
      type="button",
      :disabled="props.sampleCount < 2",
      :aria-label="props.isPlaying ? 'Pausar reproducción' : 'Reproducir día'",
      @click="props.isPlaying ? emit('pause') : emit('play')"
    )
      span {{ props.isPlaying ? "Pausar" : "Reproducir" }}
    label.speed-label
      | Velocidad
      u-select(
        :model-value="props.speed",
        :items="speeds",
        aria-label="Velocidad de reproducción",
        @update:model-value="emit('speedChange', $event)"
      )
  .seek-block(v-if="props.sampleCount")
    .seek-heading
      label(for="day-sample-seek") Muestra {{ props.index + 1 }} de {{ props.sampleCount }}
      span.sample-time {{ props.currentTime }}
    u-slider#day-sample-seek.my-3(
      :min="0",
      :max="Math.max(props.sampleCount - 1, 0)",
      :model-value="props.index",
      :disabled="props.sampleCount < 2",
      aria-label="Buscar muestra por orden cronológico",
      @update:model-value="onSeek"
    )
    day-color-reel(
      :measurements="props.measurements",
      :index="props.index",
      @seek="emit('seek', $event)"
    )
    p.helper-text {{ props.spacingText }}
</template>

<script setup lang="ts">
const props = defineProps<{
  sampleCount: number;
  measurements: { createdAt: string; averageColor: string }[];
  index: number;
  speed: number;
  isPlaying: boolean;
  currentTime: string;
  spacingText: string;
}>();

const emit = defineEmits<{
  play: [];
  pause: [];
  seek: [index: number];
  speedChange: [speed: number];
}>();

const speeds = [
  { label: "0,5×", value: 0.5 },
  { label: "1×", value: 1 },
  { label: "2×", value: 2 },
];
function onSeek(value: number | number[] | undefined) {
  if (typeof value === "number") emit("seek", value);
}
</script>

<style lang="scss" scoped>
.controls {
  display: grid;
  gap: 1rem;
  padding: 1rem 0;
}

.control-row,
.seek-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.speed-label {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: var(--ui-text-toned);
  font-size: 0.875rem;
}

.seek-block {
  display: grid;
  gap: 0.4rem;
}

.seek-heading {
  font-size: 0.875rem;
  font-weight: 600;
}

.sample-time {
  font-family: Inconsolata, monospace;
  color: var(--ui-text-toned);
}

.helper-text {
  margin: 0;
  color: var(--ui-text-muted);
  font-size: 0.8rem;
}
</style>
