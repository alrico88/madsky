<template lang="pug">
section.stage.rounded-2xl.shadow-sm(
  :style="{ backgroundColor: props.measurement.averageColor, color: textColor }"
)
  .stage-content
    p.stage-kicker MADRID · {{ dateLabel }}
    p.stage-time {{ timeLabel }}
    p.stage-color {{ props.measurement.averageColor }}
    .weather(v-if="props.measurement.weather")
      icon.weather-icon(
        :name="mapIcon(props.measurement.weather.weatherCode, isDay)",
        size="28",
        aria-hidden="true"
      )
      span {{ props.measurement.weather.temperature }} °C
      span(
        v-if="props.measurement.weather.feelsLike !== props.measurement.weather.temperature"
      )
        | Sensación {{ props.measurement.weather.feelsLike }} °C
    p.weather.weather-missing(v-else) Sin datos meteorológicos para esta muestra
    u-button.mt-6.rounded-full(
      :to="'/record/' + props.measurement.id",
      :style="{ outlineColor: textColor, '--tw-ring-color': textColor }",
      color="neutral",
      variant="outline",
      :ui="{ base: 'bg-transparent text-inherit ring-current hover:bg-transparent active:bg-transparent focus-visible:outline-current' }"
    ) Ver registro completo
</template>

<script setup lang="ts">
interface DayMeasurement {
  id: number;
  createdAt: string;
  averageColor: string;
  weather: {
    temperature: number;
    feelsLike: number;
    weatherCode: number;
  } | null;
}

const props = defineProps<{ measurement: DayMeasurement }>();

const { mapIcon } = useWeather();
const textColor = useContrastColor(() => props.measurement.averageColor);

const dateLabel = computed(() =>
  new Intl.DateTimeFormat("es-ES", {
    timeZone: "Europe/Madrid",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(props.measurement.createdAt))
);
const timeLabel = computed(() =>
  new Intl.DateTimeFormat("es-ES", {
    timeZone: "Europe/Madrid",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).format(new Date(props.measurement.createdAt))
);
const isDay = computed(() => {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Madrid",
      hour: "2-digit",
      hourCycle: "h23",
    }).format(new Date(props.measurement.createdAt))
  );
  return hour >= 7 && hour < 21 ? "day" : "night";
});
</script>

<style lang="scss" scoped>
.stage {
  display: grid;
  min-height: min(52vh, 34rem);
  place-items: center;
  padding: clamp(1.5rem, 6vw, 4rem);
  transition: background-color 180ms ease;

  &-content {
    width: 100%;
    max-width: 48rem;
    text-align: center;
  }

  &-kicker {
    margin: 0 0 1rem;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  &-time {
    margin: 0;
    font-size: clamp(2.5rem, 13vw, 8rem);
    font-weight: 800;
    line-height: 0.95;
    font-variant-numeric: tabular-nums;
  }

  &-color {
    margin: 1.25rem 0 0;
    font-family: Inconsolata, monospace;
    font-size: 1.2rem;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}

.weather {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem 1rem;
  margin-top: 1.5rem;
  font-size: 0.95rem;

  &-missing {
    opacity: 0.8;
  }
}
</style>
