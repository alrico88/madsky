<template lang="pug">
nav-bar
period-header(
  :start="data?.days[0]",
  :end="data?.days.at(-1)",
  :page="page",
  :pending="pending",
  :has-next="data?.hasNext"
)
.px-4.pb-4(:aria-busy="pending")
  .display-options
    fieldset.option-group.day-filter
      legend Filtrar días
      label.filter-label(for="day-weather-filter") Condición del día
      u-select#day-weather-filter(
        v-model="weatherFilter",
        :items="weatherFilters",
        :disabled="pending",
        aria-label="Condición del día"
      )
    fieldset.option-group
      legend Luz solar
      .option-list
        u-button(
          color="neutral",
          :variant="showDaylightDuration ? 'solid' : 'outline'",
          icon="i-tabler-clock",
          :aria-pressed="showDaylightDuration",
          @click="showDaylightDuration = !showDaylightDuration"
        ) Duración del día
        u-button(
          color="neutral",
          :variant="showSolarEvents ? 'solid' : 'outline'",
          icon="i-tabler-sunrise",
          :aria-pressed="showSolarEvents",
          @click="showSolarEvents = !showSolarEvents"
        ) Salida y puesta
        u-button(
          color="neutral",
          :variant="showTwilight ? 'solid' : 'outline'",
          icon="i-tabler-moon-stars",
          :aria-pressed="showTwilight",
          @click="showTwilight = !showTwilight"
        ) Crepúsculos
        u-button(
          color="neutral",
          :variant="showSolarNoon ? 'solid' : 'outline'",
          icon="i-tabler-sun-high",
          :aria-pressed="showSolarNoon",
          @click="showSolarNoon = !showSolarNoon"
        ) Mediodía
    fieldset.option-group
      legend Meteorología
      .option-list
        u-button(
          color="neutral",
          :variant="showClouds ? 'solid' : 'outline'",
          icon="i-tabler-cloud",
          :aria-pressed="showClouds",
          @click="showClouds = !showClouds"
        ) Nubosidad
        u-button(
          color="neutral",
          :variant="showRain ? 'solid' : 'outline'",
          icon="i-tabler-cloud-rain",
          :aria-pressed="showRain",
          @click="showRain = !showRain"
        ) Lluvia
  .filter-summary(
    v-if="weatherFilter !== 'all' && !pending && !error",
    role="status"
  )
    span {{ rows.length }} días en esta página. {{ filterDescription }} Según las mediciones disponibles.
    u-button(
      color="neutral",
      variant="outline",
      type="button",
      @click="weatherFilter = 'all'"
    ) Quitar filtro
  .layer-legend(
    v-if="showSolarEvents || showTwilight || showSolarNoon || showClouds || showRain"
  )
    span.sunrise(v-if="showSolarEvents") Salida
    span.sunset(v-if="showSolarEvents") Puesta
    span.twilight(v-if="showTwilight") Crepúsculo civil
    span.noon(v-if="showSolarNoon") Mediodía solar
    span.clouds(v-if="showClouds") Nubosidad: 0–100%
    span.rain(v-if="showRain") Lluvia registrada
    span.missing(v-if="showClouds || showRain") Sin datos
  .results-loading(v-if="pending", role="status", aria-live="polite")
    .loading-message
      u-icon.animate-spin(name="i-lucide-loader-circle", aria-hidden="true")
      span Cargando días{{ weatherFilter !== "all" ? " que cumplen el filtro" : "" }}…
    .loading-preview(aria-hidden="true")
      .loading-row(v-for="row in 12", :key="row")
        u-skeleton.h-3.w-16
        u-skeleton.h-3
  u-alert(
    v-else-if="error",
    title="No se pudieron cargar los días",
    color="error",
    icon="i-tabler-alert-circle"
  )
    template(#actions)
      u-button(color="error", variant="outline", @click="refresh()") Reintentar
  .overflow-x-auto(v-else-if="rows.length")
    .timeline
      .time-axis
        .day-label
        .time-labels
          span(v-for="hour in 24", :key="hour") {{ String(hour - 1).padStart(2, "0") }}h
      .day-row(
        v-for="day in rows",
        :key="day.date",
        :class="{ expanded: showDaylightDuration || showClouds || showRain }"
      )
        nuxt-link.day-label(
          :to="`/day/${day.date}`",
          :title="`Reproducir el ${formatDay(day.date)}`"
        ) {{ formatDay(day.date) }}
        .day-track
          .measurement-track(
            :class="{ 'with-duration': showDaylightDuration }"
          )
            u-tooltip(:text="tooltipText", arrow)
              .slots
                span.slot(
                  v-for="(slot, index) in day.slots",
                  :key="index",
                  :style="{ backgroundColor: slot?.color ?? '#fff' }",
                  :class="{ empty: !slot }",
                  @mouseenter="setTooltip(day.date, index, slot)"
                )
            days-solar-guide(
              v-if="showDaylightDuration || showSolarEvents || showTwilight || showSolarNoon",
              :date="day.date",
              :duration="showDaylightDuration",
              :events="showSolarEvents",
              :twilight="showTwilight",
              :noon="showSolarNoon"
            )
          days-weather-bands(
            v-if="showClouds || showRain",
            :slots="day.slots",
            :clouds="showClouds",
            :rain="showRain"
          )
  p.text-center.text-muted(v-else-if="!pending") {{ weatherFilter !== "all" ? "No hay días que cumplan este filtro. Prueba otra condición o quita el filtro." : "No hay mediciones todavía." }}
</template>

<script setup lang="ts">
import chroma from "chroma-js";
import type { DayWeatherFilter } from "~/utils/dayWeatherFilter";

const weatherFilter = computed<DayWeatherFilter>({
  get: () => {
    const value = route.query.weather;
    return weatherFilters.some((option) => option.value === value)
      ? (value as DayWeatherFilter)
      : "all";
  },
  set: (weather) => {
    navigateTo({
      path: "/days",
      query: {
        ...route.query,
        weather: weather === "all" ? undefined : weather,
        page: 0,
      },
    });
  },
});
const weatherFilters = [
  { value: "all", label: "Todos los días", description: "" },
  {
    value: "rain",
    label: "Con lluvia",
    description: "Al menos una medición con lluvia superior a 0 mm.",
  },
  {
    value: "dry",
    label: "Sin lluvia registrada",
    description: "Con datos de lluvia y ninguna medición superior a 0 mm.",
  },
  {
    value: "cloudy",
    label: "Nublados",
    description:
      "Nubosidad media de las mediciones del día de al menos el 70%.",
  },
  {
    value: "clear",
    label: "Despejados",
    description: "Nubosidad media de las mediciones del día de hasta el 20%.",
  },
];
const filterDescription = computed(
  () =>
    weatherFilters.find((option) => option.value === weatherFilter.value)
      ?.description ?? ""
);

const showDaylightDuration = shallowRef(false);
const showSolarEvents = shallowRef(false);
const showTwilight = shallowRef(false);
const showSolarNoon = shallowRef(false);
const showClouds = shallowRef(false);
const showRain = shallowRef(false);

type SlotSample = {
  color: string;
  cloudCover: number | null;
  rain: number | null;
};

const route = useRoute();
const page = computed(() => {
  const value = Number(route.query.page ?? 0);
  return Number.isInteger(value) && value >= 0 ? value : 0;
});

const { data, pending, error, refresh } = await useFetch(
  "/api/measurements/days",
  {
    query: { page, weather: weatherFilter },
    default: () => ({ days: [], measurements: [], hasNext: false }),
  }
);

const tooltipText = ref("");
const tooltipDateFormatter = new Intl.DateTimeFormat("es-ES", {
  timeZone: "UTC",
  weekday: "long",
  month: "short",
  year: "2-digit",
});
const madridDateTime = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Madrid",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function madridParts(date: Date) {
  return Object.fromEntries(
    madridDateTime.formatToParts(date).map(({ type, value }) => [type, value])
  );
}

function averageHex(colors: string[]): string {
  return chroma.average(colors, "rgb").hex();
}

function averageKnown(values: (number | null)[]) {
  const known = values.filter((value): value is number => value != null);
  return known.length
    ? known.reduce((sum, value) => sum + value, 0) / known.length
    : null;
}
function maximumKnown(values: (number | null)[]) {
  const known = values.filter((value): value is number => value != null);
  return known.length ? Math.max(...known) : null;
}

const rows = computed(() => {
  const slotsByDay = new Map<string, SlotSample[][]>(
    (data.value?.days ?? []).map(
      (date) =>
        [date, Array.from({ length: 144 }, () => [] as SlotSample[])] as const
    )
  );

  for (const measurement of data.value?.measurements ?? []) {
    const parts = madridParts(new Date(measurement.createdAt));
    const slots = slotsByDay.get(`${parts.year}-${parts.month}-${parts.day}`);
    if (!slots) continue;

    const slot = Math.floor(
      (Number(parts.hour) * 60 + Number(parts.minute)) / 10
    );
    slots[slot].push({
      color: measurement.averageColor,
      cloudCover: measurement.weather?.cloudCover ?? null,
      rain: measurement.weather?.rain ?? null,
    });
  }

  return [...slotsByDay].map(([date, slots]) => ({
    date,
    slots: slots.map((colors) =>
      colors.length
        ? {
            color: averageHex(colors.map((sample) => sample.color)),
            count: colors.length,
            cloudCover: averageKnown(colors.map((sample) => sample.cloudCover)),
            rain: maximumKnown(colors.map((sample) => sample.rain)),
          }
        : null
    ),
  }));
});

function formatDay(date: string): string {
  return new Intl.DateTimeFormat("es-ES", {
    timeZone: "UTC",
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(new Date(`${date}T12:00:00Z`));
}

function formatTooltipDate(date: string): string {
  return tooltipDateFormatter.format(new Date(`${date}T12:00:00Z`));
}

function formatTime(slot: number): string {
  const minutes = slot * 10;
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(
    minutes % 60
  ).padStart(2, "0")}`;
}

function formatSlotTitle(
  date: string,
  index: number,
  slot: { color: string; count: number } | null
): string {
  const time = formatTime(index);
  const formattedDate = formatTooltipDate(date);
  return slot
    ? `${formattedDate} ${time} · ${slot.count} muestra(s) · ${slot.color}`
    : `${formattedDate} ${time} · sin datos`;
}

function setTooltip(
  date: string,
  index: number,
  slot: { color: string; count: number } | null
): void {
  tooltipText.value = formatSlotTitle(date, index, slot);
}

useSeoMeta({
  title: "Colores del cielo por día · MADSKY",
  description:
    "Compara los colores del cielo de Madrid a lo largo de cada día.",
});
</script>

<style lang="scss" scoped>
.results-loading {
  padding-block: 0.5rem;

  .loading-message {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    color: var(--ui-text-muted);
    font-size: 0.8125rem;
  }

  .loading-preview {
    display: grid;
    gap: 0.5rem;

    .loading-row {
      display: grid;
      grid-template-columns: 6rem minmax(0, 1fr);
      gap: 0.5rem;
    }
  }
}

.display-options {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 2rem;
  margin-bottom: 1rem;
  padding: 0.875rem 1rem;
  border: 1px solid var(--ui-border);
  border-radius: 0.75rem;
  background: var(--ui-bg-muted);

  .option-group {
    min-width: 0;
    padding: 0;
    border: 0;

    legend {
      padding: 0;
      margin-bottom: 0.5rem;
      color: var(--ui-text-muted);
      font-size: 0.75rem;
      font-weight: 500;
    }

    .option-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
  }

  .day-filter {
    .filter-label {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip-path: inset(50%);
    }
  }
}

.filter-summary {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.5rem 1rem;
  margin-bottom: 1rem;
  color: var(--ui-text-muted);
  font-size: 0.8125rem;
}

.layer-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.25rem;
  margin-bottom: 0.875rem;
  color: var(--ui-text-muted);
  font-size: 0.6875rem;

  span {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;

    &::before {
      content: "";
      width: 3px;
      height: 10px;
    }
    &.sunrise::before {
      background: #b45309;
    }
    &.sunset::before {
      background: #4338ca;
    }
    &.twilight::before {
      background: #c4b5fd;
      width: 12px;
      border: 1px solid #7c3aed;
    }
    &.noon::before {
      background: #be123c;
    }
    &.clouds::before {
      width: 20px;
      background: linear-gradient(
        to right,
        var(--ui-bg-elevated),
        var(--ui-text-toned)
      );
    }
    &.rain::before {
      width: 12px;
      background: #0284c7;
    }
    &.missing::before {
      width: 12px;
      background: repeating-linear-gradient(
        135deg,
        var(--ui-border) 0 2px,
        #fff 2px 4px
      );
      border: 1px solid var(--ui-border);
    }
  }
}

.measurement-track {
  position: relative;
  &.with-duration {
    padding-bottom: 20px;
  }
}
.timeline {
  width: 100%;
  min-width: 900px;
  @media (min-width: 960px) {
    min-width: 0;
  }
}

.time-axis,
.day-row {
  display: grid;
  grid-template-columns: 6rem minmax(0, 1fr);
  gap: 0.5rem;
  align-items: center;
}

.time-axis {
  margin-bottom: 0.35rem;
}

.time-labels,
.slots {
  display: grid;
  grid-template-columns: repeat(144, minmax(0, 1fr));
}

.time-labels span {
  grid-column: span 6;
  font: 0.7rem monospace;
  color: var(--ui-text-muted);
}

.day-row {
  min-height: 15px;
  margin-bottom: 2px;

  &.expanded {
    align-items: start;
    margin-bottom: 6px;
  }
}

.day-label {
  position: sticky;
  left: 0;
  z-index: 1;
  background: white;
  font-size: 0.75rem;
  white-space: nowrap;
}

.slot {
  height: 14px;

  &.empty {
    border: 1px solid var(--ui-border);
  }
}
</style>
