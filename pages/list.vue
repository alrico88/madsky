<template lang="pug">
nav-bar
.grid.grid-cols-1
  measurement-list-item(
    v-for="measurement of data",
    :key="measurement.id",
    :id="measurement.id",
    :color="measurement.averageColor",
    :date="measurement.createdAt",
    :image="measurement.image",
    @mouseenter="handleHover(measurement.createdAt)",
    @mouseleave="handleReset"
  )
next-page-link(:url="nextPage")
day-scroller(:text="dayScrolledText")
</template>

<script setup lang="ts">
const { currPage, nextPage } = usePage("list");

const { data } = await useFetch("/api/measurements", {
  query: {
    page: currPage,
  },
  default: () => [],
  deep: false,
  watch: [currPage],
});

const { handleHover, handleReset, dayScrolledText } = useDayScroll();

useSeoMeta({
  title: "MADSKY",
  description:
    "Observa el cielo de Madrid y sus colores a lo largo de los días",
  keywords: "Madrid,cielo,color,colores",
});
</script>
