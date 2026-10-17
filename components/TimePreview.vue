<template lang="pug">
u-tooltip(text="Ver registro", arrow)
  u-button.bg-color(
    color="neutral",
    variant="outline",
    :ui="{ base: 'ring-current focus-visible:outline-current' }",
    :to="`/record/${id}`",
    :class="{ opacify: !isMidnight }"
  ) {{ isMidnight ? formattedDayTag : timeAgo }}
</template>

<script setup lang="ts">
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
  color: v-bind("textColor");
  outline-color: v-bind("textColor");
  --tw-ring-color: v-bind("textColor");
}
</style>
