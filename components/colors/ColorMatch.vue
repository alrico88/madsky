<template lang="pug">
article.match-card
  .match-colors
    .match-swatch(
      :style="{ backgroundColor: measurement.averageColor }",
      :aria-label="`Color registrado ${measurement.averageColor}`"
    )
    .match-details
      p.match-color {{ measurement.averageColor }}
      p.match-time {{ timeLabel }}
  .match-links
    nuxt-link.match-link(:to="`/record/${measurement.id}`") Ver registro
    nuxt-link.match-day(:to="`/day/${dayKey}`") Ver día
</template>

<script setup lang="ts">
interface ColorMatchMeasurement {
  id: number;
  createdAt: string | Date;
  averageColor: string;
  distance: number;
}

const props = defineProps<{
  measurement: ColorMatchMeasurement;
}>();

const madridDateTime = new Intl.DateTimeFormat("es-ES", {
  timeZone: "Europe/Madrid",
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});
const madridDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Madrid",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const capturedAt = computed(() => new Date(props.measurement.createdAt));
const dayKey = computed(() => {
  const parts = Object.fromEntries(
    madridDate
      .formatToParts(capturedAt.value)
      .map(({ type, value }) => [type, value])
  );

  return `${parts.year}-${parts.month}-${parts.day}`;
});
const timeLabel = computed(() => madridDateTime.format(capturedAt.value));
</script>

<style lang="scss" scoped>
.match-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.8rem 0;
  border-bottom: 1px solid var(--ui-border);

  .match-colors {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 0.85rem;

    .match-swatch {
      width: 3.25rem;
      height: 3.25rem;
      flex: 0 0 auto;
      border: 1px solid rgb(15 23 42 / 12%);
      border-radius: 0.75rem;
      box-shadow: inset 0 0 0 1px rgb(255 255 255 / 18%);

      @media (max-width: 480px) {
        width: 2.75rem;
        height: 2.75rem;
      }
    }

    .match-details {
      min-width: 0;

      .match-color {
        margin: 0;
        color: #0f172a;
        font-family: monospace;
        font-size: 0.95rem;
        font-weight: 700;
      }

      .match-time {
        margin: 0.2rem 0 0;
        color: var(--ui-text-muted);
        font-size: 0.85rem;
        text-transform: capitalize;
      }
    }
  }

  .match-links {
    display: flex;
    flex: 0 0 auto;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.3rem;
    font-size: 0.85rem;

    .match-link {
      color: #0369a1;
      font-weight: 600;
    }

    .match-day {
      color: var(--ui-text-muted);
    }

    .match-link,
    .match-day {
      &:hover {
        text-decoration: underline;
      }
    }

    @media (max-width: 480px) {
      font-size: 0.78rem;
    }
  }
}
</style>
