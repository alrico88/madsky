<template lang="pug">
.year-calendar(aria-label="Calendario anual del color del cielo")
  section.month(
    v-for="month in months",
    :key="month.key",
    :aria-label="month.name"
  )
    h2.month-name {{ month.name }}
    .month-grid
      span.weekday(
        v-for="(weekday, index) in weekdays",
        :key="index",
        :aria-hidden="true"
      ) {{ weekday }}
      template(
        v-for="(cell, index) in month.cells",
        :key="cell?.date ?? `${month.key}-blank-${index}`"
      )
        span.blank(v-if="!cell", aria-hidden="true")
        nuxt-link.day-cell(
          v-else-if="cell.measurement?.count && cell.measurement.color",
          :to="`/day/${cell.date}`",
          :title="labelFor(cell)",
          :aria-label="labelFor(cell)",
          :style="{ backgroundColor: cell.measurement.color, color: chroma.contrast(cell.measurement.color, '#fff') >= 4.5 ? '#fff' : '#0f172a' }"
        ) {{ cell.dayNumber }}
        span.day-cell.missing(
          v-else,
          :title="labelFor(cell)",
          :aria-label="labelFor(cell)"
        ) {{ cell.dayNumber }}
</template>

<script setup lang="ts">
import { computed } from "vue";
import chroma from "chroma-js";

interface CalendarDay {
  date: string;
  color: string | null;
  count: number;
}

interface CalendarCell {
  date: string;
  dayNumber: number;
  measurement: CalendarDay | undefined;
}

const props = defineProps<{
  year: number;
  days: CalendarDay[];
}>();

const weekdays = ["L", "M", "X", "J", "V", "S", "D"];
const monthFormatter = new Intl.DateTimeFormat("es-ES", {
  timeZone: "UTC",
  month: "long",
});
const dayFormatter = new Intl.DateTimeFormat("es-ES", {
  timeZone: "UTC",
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});
const dayByDate = computed(
  () => new Map(props.days.map((day) => [day.date, day]))
);

const months = computed(() =>
  Array.from({ length: 12 }, (_, monthIndex) => {
    const firstDay = new Date(Date.UTC(props.year, monthIndex, 1));
    const daysInMonth = new Date(
      Date.UTC(props.year, monthIndex + 1, 0)
    ).getUTCDate();
    const firstWeekday = (firstDay.getUTCDay() + 6) % 7;
    const cells: Array<CalendarCell | null> = Array.from(
      { length: firstWeekday },
      () => null
    );

    for (let dayNumber = 1; dayNumber <= daysInMonth; dayNumber += 1) {
      const date = `${props.year}-${String(monthIndex + 1).padStart(2, "0")}-${String(dayNumber).padStart(2, "0")}`;
      cells.push({ date, dayNumber, measurement: dayByDate.value.get(date) });
    }

    return {
      key: `${props.year}-${monthIndex + 1}`,
      name: monthFormatter.format(firstDay),
      cells,
    };
  })
);

function labelFor(cell: CalendarCell): string {
  const label = dayFormatter.format(new Date(`${cell.date}T12:00:00Z`));

  if (!cell.measurement?.count || !cell.measurement.color) {
    return `${label}: sin mediciones diurnas`;
  }

  return `${label}: ${cell.measurement.count} mediciones diurnas, color ${cell.measurement.color}`;
}
</script>

<style lang="scss" scoped>
.year-calendar {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1.75rem 1.5rem;
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.month {
  min-width: 0;

  &-name {
    margin: 0 0 0.55rem;
    color: #334155;
    font-size: 0.95rem;
    font-weight: 600;
    text-transform: capitalize;
  }

  &-grid {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 0.22rem;
  }
}

.weekday {
  padding-bottom: 0.2rem;
  color: var(--ui-text-muted);
  font-size: 0.68rem;
  line-height: 1.2rem;
  text-align: center;
}

.day-cell,
.blank {
  display: flex;
  aspect-ratio: 1;
  align-items: center;
  justify-content: center;
  min-width: 0;
  border-radius: 0.2rem;
}

.day-cell {
  color: white;
  font-size: clamp(0.58rem, 1vw, 0.74rem);
  font-variant-numeric: tabular-nums;
  text-decoration: none;
}

a.day-cell {
  transition:
    outline-color 120ms ease,
    transform 120ms ease;

  &:hover,
  &:focus-visible {
    z-index: 1;
    outline: 2px solid #0f172a;
    outline-offset: 1px;
    transform: scale(1.08);
  }
}

.missing {
  background: #e2e8f0;
  color: #64748b;
  text-shadow: none;
}
</style>
