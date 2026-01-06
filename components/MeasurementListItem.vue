<template lang="pug">
.image-item.on-hover.flex.position-relative.items-center(
  :class="{ toggled: isToggled, 'border-t border-b': isToggled }",
  @click="isToggled = !isToggled"
)
  .position-absolute.h-full.w-full.text-center(v-if="isToggled")
    img.w-full.h-full(:src="imageUrl")
  .position-absolute.h-full.w-full.flex.justify-between.items-center.p-2
    color-preview(:color="color", :text-color="textColor")
    time-preview(
      :id="id",
      :color="color",
      :text-color="textColor",
      :date="date"
    )
</template>

<script setup lang="ts">
const props = defineProps<{
  id: number;
  color: string;
  date: string;
  image: string;
}>();

const { imageUrl, loadImage } = useMeasurementImage(() => props.image);
const textColor = useContrastColor(() => props.color);

const isToggled = ref(false);
whenever(isToggled, loadImage);
</script>

<style lang="scss" scoped>
.image-item {
  height: 50px;
  background-color: v-bind("color");
  transition: height 0.2s ease-in-out;
  --bs-border-color: v-bind("textColor");

  &.toggled {
    height: 400px;
  }

  img {
    object-fit: contain;
  }
}
</style>
