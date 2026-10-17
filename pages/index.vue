<template lang="pug">
nav-bar(:pending="pending", has-refresh, @refresh="() => refresh()")
period-header(
  :start="data.at(-1)?.createdAt",
  :end="data[0]?.createdAt",
  :page="currPage",
  :pending="pending",
  :has-next="!!data.length"
)
.grid.grid-cols-2(ref="measurements", class="md:grid-cols-4 lg:grid-cols-6")
  measurement-grid-item(
    v-for="measurement of data",
    :key="measurement.id",
    :id="measurement.id",
    :color="measurement.averageColor",
    :date="measurement.createdAt",
    :image="measurement.image",
    :data-measurement-date="measurement.createdAt"
  )
day-scroller(:text="dayScrolledText", :show="isScrolling")
</template>

<script setup lang="ts">
const { currPage } = usePage("");

const { data, pending, refresh } = await useFetch("/api/measurements", {
  query: {
    page: currPage,
  },
  default: () => [],
  deep: false,
  watch: [currPage],
});

const measurements = useTemplateRef<HTMLElement>("measurements");
const { dayScrolledText, isScrolling } = useDayScroll(measurements);

useSeoMeta({
  title: "MADSKY",
  description:
    "Observa el cielo de Madrid y sus colores a lo largo de los días",
  keywords: "Madrid,cielo,color,colores",
});
</script>
