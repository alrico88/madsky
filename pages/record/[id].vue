<template lang="pug">
nav-bar
u-container.py-4(as="main")
  record-skeleton(v-if="pending")
  u-alert(
    v-else-if="error || !data",
    color="error",
    title="No se pudo cargar el registro",
    icon="i-tabler-alert-circle"
  )
  template(v-else)
    u-card.mb-4(:ui="{ body: 'p-3 sm:p-4' }")
      .flex.gap-2.text-center.items-center.justify-center
        div
          u-button(
            color="neutral",
            variant="ghost",
            @click="findAdjacent('prev')",
            :disabled="isNavigating",
            title="Ver anterior"
          )
            icon(size="40", name="tabler:caret-left")
        .w-full
          .relative.w-full(style="padding-bottom: min(500px, 100%)")
            .absolute.inset-0.flex.items-center.justify-center
              img.max-w-full.max-h-full.rounded.shadow-md.shadow(
                :src="getImageSrc(data.image)"
              )
        div
          u-button(
            color="neutral",
            variant="ghost",
            @click="findAdjacent('next')",
            :disabled="isNavigating",
            title="Ver siguiente"
          )
            icon(size="40", name="tabler:caret-right")
    .grid.gap-4
      u-card(as="section", title="Registro")
        .grid.gap-5(class="sm:grid-cols-2")
          div
            h4.text-toned Color del cielo:
            u-button.color-preview.font-mono.data(
              color="neutral",
              variant="outline",
              title="Copiar al portapapeles",
              :ui="{ base: 'ring-current focus-visible:outline-current' }",
              @click="() => copy()",
              :style="{ backgroundColor: data.averageColor, color: textColor, outlineColor: textColor, '--tw-ring-color': textColor }"
            ) {{ data.averageColor }}
          div
            h4.text-toned Tomado el:
            .data.font-mono {{ dateFormatter.format(new Date(data.createdAt)) }}
      u-card(as="section", title="Meteorología")
        .grid.grid-cols-1.gap-4(class="md:grid-cols-3", v-if="data.weather")
          div
            h4.text-toned Condición:
            .data.font-mono
              icon(:name="mapIcon(data.weather.weatherCode, isDay)", size="40")
          div
            h4.text-toned Temperatura:
            .data.font-mono {{ data.weather.temperature }}ºC (Parecen {{ data.weather.feelsLike }}º C)
          div
            h4.text-toned Cobertura de nubes:
            .data.font-mono {{ data.weather.cloudCover }}%
          div
            h4.text-toned Visibilidad:
            .data.font-mono {{ processNumber(data.weather.visibility / 1000) }} Km.
          div
            h4.text-toned Humedad:
            .data.font-mono {{ data.weather.humidity }}% {{ Number(data.weather.precipitation) > 0 ? "(Lloviendo)" : "" }}
          div
            h4.text-toned Lluvia:
            .data.font-mono {{ data.weather.rain }} mm
          div
            h4.text-toned Nieve:
            .data.font-mono {{ data.weather.snowfall }} mm
          div
            h4.text-toned Viento:
            .data.font-mono {{ data.weather.windSpeed }} km/h hacia #[span(:title="data.weather.windDegrees.toString()") {{ getDirectionName(data.weather.windDegrees) }}]
          div
            h4.text-toned Presión atmosférica:
            .data.font-mono {{ data.weather.pressure }} hPa.
        u-alert(
          v-if="!data.weather",
          title="Sin datos meteorológicos",
          color="neutral",
          icon="i-tabler-cloud-question"
        )
      u-card(as="section", title="Iluminación")
        .grid.grid-cols-1.gap-6(class="md:grid-cols-3")
          div
            light-times(:date="data.createdAt")
          div
            light-position(:date="data.createdAt")
          div
            light-moon(:date="data.createdAt")
</template>

<script setup lang="ts">
import { processNumber } from "number-helper-functions";

useSeoMeta({
  title: "Detalle del cielo",
});

const { mapIcon } = useWeather();

const route = useRoute();

const { data, pending, error } = await useLazyFetch(
  () => `/api/measurement/id/${route.params.id}`
);

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode ?? 500,
    statusMessage:
      error.value.statusCode === 404
        ? "Registro no encontrado"
        : "Error al obtener registro",
    fatal: true,
  });
}

const dateFormatter = new Intl.DateTimeFormat("es-ES", {
  timeZone: "Europe/Madrid",
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});
const hourFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Madrid",
  hour: "2-digit",
  hourCycle: "h23",
});

const textColor = useContrastColor(() => data.value?.averageColor ?? "black");

function getImageSrc(partial: string): string {
  return `/api/image/${partial}`;
}

const { arrowleft, arrowright } = useMagicKeys();

const isNavigating = shallowRef(false);

async function findAdjacent(direction: "prev" | "next") {
  if (!data.value || pending.value || isNavigating.value) return;

  isNavigating.value = true;
  const currentPath = route.path;
  try {
    const id = await $fetch(`/api/measurement/${direction}`, {
      query: { time: data.value.createdAt },
    });
    if (route.path !== currentPath) return;
    if (id == null) {
      toast.add({
        color: "info",
        title:
          direction === "prev"
            ? "No hay registros anteriores"
            : "No hay registros siguientes",
      });
      return;
    }
    await navigateTo(`/record/${id}`);
  } catch {
    toast.add({
      title: "No se pudo cargar el registro. Inténtalo de nuevo.",
      color: "error",
    });
  } finally {
    isNavigating.value = false;
  }
}

whenever(arrowleft!, () => findAdjacent("prev"));
whenever(arrowright!, () => findAdjacent("next"));

const { copy, copied } = useClipboard({
  source: () => data.value?.averageColor ?? "",
});

const toast = useToast();

whenever(copied, () => {
  toast.add({ title: "Color copiado al portapapeles", color: "success" });
});

const { getDirectionName } = useGeo();

const isDay = computed(() => {
  if (!data.value) return "night";
  const hour = Number(hourFormatter.format(new Date(data.value.createdAt)));

  return hour > 7 && hour < 21 ? "day" : "night";
});
</script>

<style lang="scss" scoped>
button:disabled {
  opacity: 0.4;
  cursor: wait;
}

.color-preview {
  display: inline-block;
}
</style>
