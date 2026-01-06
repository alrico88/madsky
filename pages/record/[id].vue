<template lang="pug">
nav-bar
.container.py-4.mx-auto
  div(v-if="pending || error || !data")
    b-alert.bg-blue-800(v-if="pending") #[icon(name="svg-spinners:270-ring-with-bg")] Cargando
    b-alert.bg-red-800(
      v-if="!pending && (!data || error != null)",
      variant="danger"
    )
      template(v-if="!data") Registro no encontrado
      template(v-if="error != null") Error al obtener registro
  template(v-if="data && !pending && !error")
    .flex.gap-2.text-center.mb-4.items-center.justify-center
      div
        button(variant="link", @click="findPrev", title="'Ver anterior'")
          icon(size="40", name="tabler:caret-left")
      .w-full
        .relative.w-full(style="padding-bottom: min(500px, 100%)")
          .absolute.inset-0.flex.items-center.justify-center
            img.max-w-full.max-h-full.rounded.shadow-md.shadow(
              :src="getImageSrc(data.image)"
            )
      div
        button(variant="link", @click="findNext", title="'Ver siguiente'")
          icon(size="40", name="tabler:caret-right")
    .flex.flex-col.gap-4
      .flex.flex-row.gap-5.justify-center
        div(class="flex-basis-1/3")
          h4.text-slate-600 Color del cielo:
          .color-preview.p-2.rounded.cursor-pointer.font-mono.data(
            title="'Copiar al portapapeles'",
            @click="() => copy()",
            :style="{ backgroundColor: data.averageColor, color: textColor }"
          ) {{ data.averageColor }}
        div(class="flex-basis-1/3")
          h4.text-slate-600 Tomado el:
          .data.font-monospace {{ dayjs(data.createdAt).format("dddd DD MMMM YYYY[,] HH:mm") }}
      section
        h5.mb-3.fw-bold Meteorología
        .grid.grid-cols-1.gap-4(class="md:grid-cols-3", v-if="data.weather")
          div
            h4.text-slate-600 Condición:
            .data.font-monospace
              icon(:name="mapIcon(data.weather.weatherCode, isDay)", size="40")
          div
            h4.text-slate-600 Temperatura:
            .data.font-monospace {{ data.weather.temperature }}ºC (Parecen {{ data.weather.feelsLike }}º C)
          div
            h4.text-slate-600 Cobertura de nubes:
            .data.font-monospace {{ data.weather.cloudCover }}%
          div
            h4.text-slate-600 Visibilidad:
            .data.font-monospace {{ processNumber(data.weather.visibility / 1000) }} Km.
          div
            h4.text-slate-600 Humedad:
            .data.font-monospace {{ data.weather.humidity }}% {{ Number(data.weather.precipitation) > 0 ? "(Lloviendo)" : "" }}
          div
            h4.text-slate-600 Lluvia:
            .data.font-monospace {{ data.weather.rain }} mm
          div
            h4.text-slate-600 Nieve:
            .data.font-monospace {{ data.weather.snowfall }} mm
          div
            h4.text-slate-600 Viento:
            .data.font-monospace {{ data.weather.windSpeed }} km/h hacia #[span(:title="data.weather.windDegrees.toString()") {{ getDirectionName(data.weather.windDegrees) }}]
          div
            h4.text-slate-600 Presión atmosférica:
            .data.font-monospace {{ data.weather.pressure }} hPa.
        b-alert.bg-red-800(v-if="!data.weather") Sin datos
      section
        h5.mb-3.fw-bold Iluminación
        .grid.grid-cols-1.gap-6(class="md:grid-cols-3")
          div
            light-times(:date="data.createdAt")
          div
            light-position(:date="data.createdAt")
          div
            light-moon(:date="data.createdAt")
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import "dayjs/locale/es";
dayjs.locale("es");
import { processNumber } from "number-helper-functions";
import is from "@sindresorhus/is";

useSeoMeta({
  title: "Detalle del cielo",
});

definePageMeta({
  middleware: ["record"],
});

const { mapIcon } = useWeather();

const route = useRoute();

const { data, pending, error } = await useFetch(
  `/api/measurement/id/${route.params.id}`
);

const textColor = useContrastColor(() => data.value?.averageColor ?? "black");

function getImageSrc(partial: string): string {
  return `/api/image/${partial}`;
}

const { arrowleft, arrowright } = useMagicKeys();

function goToRecord(id?: number | null): void {
  if (!is.nullOrUndefined(id)) {
    navigateTo(`/record/${id}`);
  }
}

async function findNext() {
  if (is.nullOrUndefined(data.value)) {
    return;
  }

  const nextId = await $fetch("/api/measurement/next", {
    query: {
      time: data.value.createdAt,
    },
  });

  goToRecord(nextId);
}

async function findPrev() {
  if (is.nullOrUndefined(data.value)) {
    return;
  }

  const prevId = await $fetch("/api/measurement/prev", {
    query: {
      time: data.value.createdAt,
    },
  });

  goToRecord(prevId);
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
whenever(arrowleft!, () => {
  findPrev();
});

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
whenever(arrowright!, () => {
  findNext();
});

const { copy, copied } = useClipboard({
  source: () => data.value?.averageColor ?? "",
});

const { $toast } = useNuxtApp();

whenever(copied, () => {
  $toast.success("Color copiado al portapapeles");
});

const { getDirectionName } = useGeo();

const isDay = computed(() => {
  const hour = dayjs(data.value?.createdAt).hour();

  return hour > 7 && hour < 21 ? "day" : "night";
});
</script>

<style lang="scss" scoped>
.color-preview {
  display: inline-block;
}
</style>
