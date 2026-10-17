<template lang="pug">
.solar-guide(v-if="solar")
  template(v-if="twilight")
    .twilight(
      :style="{ left: `${solar.dawn}%`, width: `${solar.start - solar.dawn}%` }",
      :title="solar.dawnLabel",
      :aria-label="solar.dawnLabel",
      role="img"
    )
    .twilight(
      :style="{ left: `${solar.end}%`, width: `${solar.dusk - solar.end}%` }",
      :title="solar.duskLabel",
      :aria-label="solar.duskLabel",
      role="img"
    )
  .sun-marker.noon(
    v-if="noon",
    :style="{ left: `${solar.noon}%` }",
    :title="solar.noonLabel",
    :aria-label="solar.noonLabel",
    role="img"
  )
  template(v-if="events")
    .sun-marker.sunrise(
      :style="{ left: `${solar.start}%` }",
      :title="solar.sunrise",
      :aria-label="solar.sunrise",
      role="img"
    )
    .sun-marker.sunset(
      :style="{ left: `${solar.end}%` }",
      :title="solar.sunset",
      :aria-label="solar.sunset",
      role="img"
    )
  .daylight(
    v-if="duration",
    :style="{ left: `${solar.start}%`, width: `${solar.end - solar.start}%` }",
    :title="`Duración estimada del día: ${solar.duration}`",
    :aria-label="`Duración estimada del día: ${solar.duration}`",
    role="img"
  ) {{ solar.duration }}
</template>

<script setup lang="ts">
import suncalc from "suncalc";

const props = defineProps<{
  date: string;
  duration: boolean;
  events: boolean;
  twilight: boolean;
  noon: boolean;
}>();
const [latitude, longitude] = useRuntimeConfig().public.measurementsLocation;
const formatter = new Intl.DateTimeFormat("es-ES", {
  timeZone: "Europe/Madrid",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});
const solar = computed(() => {
  const { sunrise, sunset, dawn, dusk, solarNoon } = suncalc.getTimes(
    new Date(`${props.date}T12:00:00Z`),
    Number(latitude),
    Number(longitude)
  );
  if (!Number.isFinite(sunrise.getTime()) || !Number.isFinite(sunset.getTime()))
    return null;
  function position(date: Date) {
    const parts = Object.fromEntries(
      formatter.formatToParts(date).map(({ type, value }) => [type, value])
    );
    return ((Number(parts.hour) * 60 + Number(parts.minute)) / 1440) * 100;
  }
  const minutes = Math.round((sunset.getTime() - sunrise.getTime()) / 60000);
  const start = position(sunrise);
  const end = position(sunset);
  return {
    start,
    end,
    dawn: position(dawn),
    dusk: position(dusk),
    noon: position(solarNoon),
    dawnLabel: `Crepúsculo civil matutino: ${formatter.format(dawn)}–${formatter.format(sunrise)}`,
    duskLabel: `Crepúsculo civil vespertino: ${formatter.format(sunset)}–${formatter.format(dusk)}`,
    noonLabel: `Mediodía solar estimado: ${formatter.format(solarNoon)}`,
    sunrise: `Salida del sol estimada: ${formatter.format(sunrise)}`,
    sunset: `Puesta de sol estimada: ${formatter.format(sunset)}`,
    duration: `${Math.floor(minutes / 60)} h ${String(minutes % 60).padStart(2, "0")} min`,
  };
});
</script>

<style lang="scss" scoped>
.solar-guide {
  position: absolute;
  inset: 0;
  pointer-events: none;

  .sun-marker {
    position: absolute;
    top: -1px;
    width: 3px;
    height: 16px;
    transform: translateX(-50%);
    box-shadow: 0 0 0 1px #fff;
    pointer-events: auto;

    &.noon {
      background: #be123c;
    }

    &.sunrise {
      background: #b45309;
    }
    &.sunset {
      background: #4338ca;
    }
  }

  .twilight {
    position: absolute;
    top: 0;
    height: 14px;
    border: 1px solid #7c3aed;
    background: rgb(196 181 253 / 35%);
    pointer-events: auto;
  }

  .daylight {
    position: absolute;
    top: 18px;
    height: 14px;
    border-radius: 2px;
    background: #fef3c7;
    color: #78350f;
    text-align: center;
    font-size: 10px;
    line-height: 14px;
    white-space: nowrap;
    pointer-events: auto;
  }
}
</style>
