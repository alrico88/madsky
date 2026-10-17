<template lang="pug">
section.context-bands(aria-label="Luz solar y meteorología del día")
  .context-heading
    h2 Luz y meteorología
    span Horas de Madrid
  .band-row
    span.band-label Luz solar
    .solar-track
      days-solar-guide(
        :date="date",
        :duration="true",
        :events="true",
        :twilight="true",
        :noon="true"
      )
      .playhead(
        :style="{ left: `${position}%` }",
        :title="`Muestra actual: ${currentTime}`",
        aria-hidden="true"
      )
  .band-row
    span.band-label Nubosidad
    .weather-track(role="group", aria-label="Nubosidad registrada por hora")
      span.cell(
        v-for="(slot, index) in slots",
        :key="index",
        :class="{ missing: !slot }",
        :style="slot ? { backgroundColor: `hsl(215 16% ${96 - Math.max(0, Math.min(100, slot.cloudCover)) * 0.6}%)` } : undefined",
        :title="`${time(index)} · ${slot ? `${Math.round(slot.cloudCover)}% de nubes` : 'Sin datos'}`"
      )
      .playhead(:style="{ left: `${position}%` }", aria-hidden="true")
  .band-row
    span.band-label Lluvia
    .weather-track(role="group", aria-label="Lluvia registrada por hora")
      span.cell(
        v-for="(slot, index) in slots",
        :key="index",
        :class="{ missing: !slot, rainy: (slot?.rain ?? 0) > 0 }",
        :title="`${time(index)} · ${slot ? `${slot.rain} mm de lluvia` : 'Sin datos'}`"
      )
      .playhead(:style="{ left: `${position}%` }", aria-hidden="true")
  .band-row(aria-hidden="true")
    span
    .time-axis
      span(v-for="hour in [0, 6, 12, 18, 24]", :key="hour") {{ String(hour).padStart(2, "0") }}h
  .legend
    span.daylight Día
    span.twilight Crepúsculo civil
    span.sunrise Salida
    span.sunset Puesta
    span.noon Mediodía solar
    span.clouds Nubes: 0–100%
    span.rain Lluvia
    span.missing Sin datos
</template>

<script setup lang="ts">
const props = defineProps<{
  date: string;
  index: number;
  measurements: {
    createdAt: string;
    weather: { cloudCover: number; rain: number } | null;
  }[];
}>();
const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Madrid",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});
function minutes(date: string) {
  const parts = Object.fromEntries(
    formatter
      .formatToParts(new Date(date))
      .map(({ type, value }) => [type, value])
  );
  return Number(parts.hour) * 60 + Number(parts.minute);
}
const slots = computed(() => {
  const values = Array.from(
    { length: 144 },
    () => [] as { cloudCover: number; rain: number }[]
  );
  for (const sample of props.measurements) {
    if (sample.weather)
      values[Math.floor(minutes(sample.createdAt) / 10)].push(sample.weather);
  }
  return values.map((samples) =>
    samples.length
      ? {
          cloudCover:
            samples.reduce((sum, sample) => sum + sample.cloudCover, 0) /
            samples.length,
          rain: Math.max(...samples.map((sample) => sample.rain)),
        }
      : null
  );
});
const position = computed(() => {
  const sample = props.measurements[props.index];
  return sample ? (minutes(sample.createdAt) / 1440) * 100 : 0;
});
const currentTime = computed(() =>
  props.measurements[props.index]
    ? formatter.format(new Date(props.measurements[props.index].createdAt))
    : ""
);
function time(index: number) {
  return `${String(Math.floor(index / 6)).padStart(2, "0")}:${String((index % 6) * 10).padStart(2, "0")}`;
}
</script>

<style lang="scss" scoped>
.context-bands {
  padding-block: 0.75rem 1.5rem;

  .context-heading {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.5rem;
    margin-bottom: 1rem;
    color: #64748b;
    font-size: 0.75rem;

    h2 {
      margin: 0;
      color: #334155;
      font-size: 0.875rem;
      font-weight: 500;
    }
  }

  .band-row {
    display: grid;
    grid-template-columns: 5rem minmax(0, 1fr);
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;

    .band-label {
      color: #64748b;
      font-size: 0.75rem;
    }
    .solar-track {
      position: relative;
      height: 34px;
    }
    .weather-track {
      position: relative;
      display: grid;
      grid-template-columns: repeat(144, minmax(0, 1fr));
      height: 16px;
      border-radius: 2px;
      background: #f1f5f9;

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
    .playhead {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 2px;
      background: #0f172a;
      box-shadow: 0 0 0 1px white;
      transform: translateX(-50%);
      pointer-events: none;
    }
    .time-axis {
      display: flex;
      justify-content: space-between;
      color: var(--ui-text-muted);
      font-size: 0.6875rem;
      font-variant-numeric: tabular-nums;
    }
  }

  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1rem;
    margin-top: 1rem;
    color: #64748b;
    font-size: 0.6875rem;
    span {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      &::before {
        content: "";
        width: 10px;
        height: 8px;
        border-radius: 1px;
      }
      &.daylight::before {
        background: #fef3c7;
      }
      &.twilight::before {
        background: #c4b5fd;
      }
      &.sunrise::before {
        width: 3px;
        background: #b45309;
      }
      &.sunset::before {
        width: 3px;
        background: #4338ca;
      }
      &.noon::before {
        width: 3px;
        background: #be123c;
      }
      &.clouds::before {
        width: 20px;
        background: linear-gradient(to right, #f1f5f9, #475569);
      }
      &.rain::before {
        background: #0284c7;
      }
      &.missing::before {
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
