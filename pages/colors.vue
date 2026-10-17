<template lang="pug">
nav-bar
main.colors-page
  u-card.search-panel(
    as="section",
    aria-labelledby="color-search-title",
    :ui="{ root: 'rounded-2xl shadow-sm', body: 'p-5 sm:p-5' }"
  )
    h2#color-search-title Elige un color
    u-form.color-form(
      :schema="colorSchema",
      :state="formState",
      @submit="searchColor"
    )
      u-form-field(
        name="color",
        label="Color hexadecimal",
        help="Pega un código #RRGGBB o usa el selector."
      )
        .color-controls
          u-popover
            u-button(
              color="neutral",
              variant="outline",
              aria-label="Selector de color"
            )
              span.size-6.rounded(:style="{ backgroundColor: pickerColor }")
            template(#content)
              u-color-picker.m-4(v-model="pickerColor")
          u-input.flex-1.font-mono(
            v-model="draftColor",
            size="xl",
            autocomplete="off",
            maxlength="7",
            placeholder="#7AB8D1"
          )
          u-button(
            size="xl",
            icon="i-tabler-search",
            :loading="pending",
            type="submit",
            :disabled="pending"
          ) Buscar

    .swatch-heading Tonos del cielo
    .preset-list(aria-label="Colores sugeridos")
      u-button.preset-choice(
        color="neutral",
        variant="ghost",
        v-for="preset in presets",
        :key="preset.color",
        type="button",
        :style="{ '--swatch-color': preset.color }",
        :aria-label="`${preset.label}, ${preset.color}`",
        :aria-pressed="draftColor.toUpperCase() === preset.color",
        @click="draftColor = preset.color"
      )
        span.preset-swatch
        span.preset-caption {{ preset.label }}

  u-card.results-panel(
    as="section",
    aria-labelledby="results-title",
    aria-live="polite",
    :ui="{ root: 'rounded-2xl shadow-sm', body: 'p-5 sm:p-5' }"
  )
    .results-heading
      div
        h2#results-title(v-if="activeColor") Para #[span.result-color {{ activeColor }}]
        h2#results-title(v-else) Mediciones del cielo
      u-button(
        color="neutral",
        variant="outline",
        v-if="error && activeColor",
        type="button",
        @click="refresh()"
      ) Reintentar

    colors-matches-skeleton(v-if="pending")
    u-alert.mt-4(
      v-else-if="error",
      title="No se pudo completar la búsqueda",
      description="Inténtalo de nuevo.",
      color="error",
      icon="i-tabler-alert-circle"
    )
    u-alert.mt-4(
      v-else-if="!activeColor",
      title="Elige un tono para encontrar cielos parecidos.",
      color="neutral",
      icon="i-tabler-palette"
    )
    u-alert.mt-4(
      v-else-if="!data?.results.length",
      title="Aún no hay mediciones que coincidan con este tono.",
      color="neutral",
      icon="i-tabler-search"
    )
    template(v-else)
      p.result-count {{ data.results.length }} tonos parecidos · ordenados por semejanza
      .match-list
        colors-color-match(
          v-for="measurement in data.results",
          :key="measurement.id",
          :measurement="measurement"
        )
</template>

<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
interface ColorSearchResult {
  id: number;
  createdAt: string;
  averageColor: string;
  distance: number;
}

interface ColorSearchResponse {
  color: string;
  results: ColorSearchResult[];
}

const route = useRoute();
const presets = [
  { label: "Azul claro", color: "#78B6D3" },
  { label: "Cielo limpio", color: "#4F91C4" },
  { label: "Nublado", color: "#A5B2C0" },
  { label: "Atardecer", color: "#E58D76" },
  { label: "Dorado", color: "#E7B963" },
  { label: "Crepúsculo", color: "#5D6489" },
];

const hexColorPattern = /^#[\da-f]{6}$/i;
const colorSchema = z.object({
  color: z
    .string()
    .regex(
      hexColorPattern,
      "Usa un color hexadecimal válido, por ejemplo #78B6D3."
    )
    .transform((value) => value.toUpperCase()),
});
type ColorForm = z.output<typeof colorSchema>;
const isHexColor = (value: unknown): value is string =>
  typeof value === "string" && hexColorPattern.test(value);

const routeColor = computed(() => {
  const value = route.query.color;
  return isHexColor(value) ? value.toUpperCase() : null;
});
const formState = reactive({ color: routeColor.value ?? "#78B6D3" });
const draftColor = toRef(formState, "color");
const pickerColor = computed({
  get: () => (isHexColor(draftColor.value) ? draftColor.value : "#78B6D3"),
  set: (value: string) => {
    draftColor.value = value;
  },
});
const activeColor = computed(() => routeColor.value);

watch(routeColor, (color) => {
  if (color) draftColor.value = color;
});

const { data, pending, error, refresh } =
  await useAsyncData<ColorSearchResponse | null>(
    "color-search",
    async () => {
      if (!activeColor.value) return null;
      return await $fetch<ColorSearchResponse>("/api/measurements/colors", {
        query: { color: activeColor.value },
      });
    },
    { watch: [activeColor] }
  );

async function searchColor(event: FormSubmitEvent<ColorForm>) {
  const color = event.data.color;
  await navigateTo({
    path: "/colors",
    query: { ...route.query, color },
  });
}

useSeoMeta({
  title: "Buscar por color · MADSKY",
  description: "Encuentra mediciones del cielo de Madrid por su color.",
});
</script>

<style lang="scss" scoped>
.colors-page {
  width: min(100% - 2rem, 760px);
  margin: 0 auto;
  padding: 0 0 4rem;
  @media (max-width: 560px) {
    width: min(100% - 1.25rem, 760px);
  }
}

.search-panel h2,
.results-heading h2 {
  margin: 0;
  color: #0f172a;
  font-size: 1.1rem;
  font-weight: 700;
}

.color-form {
  margin-top: 1rem;
}

.color-controls {
  display: flex;
  gap: 0.65rem;
  @media (max-width: 560px) {
    flex-wrap: wrap;
  }
}

.swatch-heading {
  margin: 1.2rem 0 0.55rem;
  color: var(--ui-text-toned);
  font-size: 0.85rem;
  font-weight: 600;
}

.preset-list {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 0.55rem;
  @media (max-width: 560px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.preset-choice {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.4rem;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--ui-text-toned);
  font-size: 0.73rem;
  cursor: pointer;

  &[aria-pressed="true"] .preset-swatch {
    outline: 2px solid #0f172a;
    outline-offset: 2px;
  }
}

.preset-swatch {
  width: 100%;
  height: 2.5rem;
  border: 1px solid rgb(15 23 42 / 12%);
  border-radius: 0.6rem;
  background: var(--swatch-color);
}

.preset-caption {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.results-panel {
  margin-top: 1rem;
}

.results-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.result-color {
  font-family: monospace;
  font-size: 0.95em;
}
</style>
