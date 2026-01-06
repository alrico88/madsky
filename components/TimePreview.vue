<template lang="pug">
tippy(content="Ver registro", arrow)
  nuxt-link.bg-color.border.border-solid.rounded.p-2.text-sm(
    :to="`/record/${id}`",
    :class="{ opacify: !isMidnight }"
  ) {{ isMidnight ? formattedDayTag : timeAgo }}
</template>

<script setup lang="ts">
import { Tippy } from "vue-tippy";

const props = defineProps<{
  id: number;
  date: string;
  color: string;
  textColor: string;
}>();

const { timeAgo, isMidnight, formattedDayTag } = useTime(() => props.date);
</script>

<style lang="scss" scoped>
.bg-color {
  background-color: v-bind("color");
  border-color: v-bind("textColor") !important;
  color: v-bind("textColor");
}
</style>
