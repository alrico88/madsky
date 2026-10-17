<template lang="pug">
.weather-bands
  .band(v-if="clouds", role="group", aria-label="Nubosidad registrada")
    span.cell(
      v-for="(slot, index) in props.slots",
      :key="index",
      :class="{ missing: slot?.cloudCover == null }",
      :style="slot?.cloudCover != null ? { backgroundColor: `hsl(215 16% ${96 - Math.max(0, Math.min(100, slot.cloudCover)) * 0.6}%)` } : undefined",
      :title="`${time(index)} · Nubosidad: ${slot?.cloudCover != null ? `${Math.round(slot.cloudCover)}%` : 'sin datos'}`"
    )
  .band(v-if="rain", role="group", aria-label="Lluvia registrada")
    span.cell(
      v-for="(slot, index) in props.slots",
      :key="index",
      :class="{ missing: slot?.rain == null, rainy: (slot?.rain ?? 0) > 0 }",
      :title="`${time(index)} · Lluvia: ${slot?.rain != null ? `${slot.rain} mm` : 'sin datos'}`"
    )
</template>

<script setup lang="ts">
const props = defineProps<{
  slots: ({ cloudCover: number | null; rain: number | null } | null)[];
  clouds: boolean;
  rain: boolean;
}>();
function time(index: number) {
  return `${String(Math.floor(index / 6)).padStart(2, "0")}:${String((index % 6) * 10).padStart(2, "0")}`;
}
</script>

<style lang="scss" scoped>
.weather-bands {
  display: grid;
  gap: 3px;
  margin-top: 3px;

  .band {
    display: grid;
    grid-template-columns: repeat(144, minmax(0, 1fr));
    height: 7px;
    background: #f8fafc;

    .cell {
      min-width: 0;

      &.rainy {
        background: #0284c7;
      }
      &.missing {
        background: repeating-linear-gradient(
          135deg,
          #e2e8f0 0 2px,
          #fff 2px 4px
        );
      }
    }
  }
}
</style>
