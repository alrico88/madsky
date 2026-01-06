<template lang="pug">
.flex.position-relative.image-item.w-full.on-hover(ref="imageRef")
  .position-absolute.w-full.h-full
    img.w-full.h-full(:src="imageUrl")
  .position-absolute.flex.w-full.justify-between.p-2.items-center.bottom-0
    color-preview(:color="color", :text-color="textColor")
    time-preview(
      :id="id",
      :color="color",
      :date="date",
      :text-color="textColor"
    )
</template>

<script setup lang="ts">
import { useContrastColor } from "~/composables/useContrastColor";

const props = defineProps<{
  id: number;
  color: string;
  date: string;
  image: string;
}>();

const imageRef = ref();

const isHovered = useElementHover(imageRef);

const { imageUrl, loadImage, unloadImage } = useMeasurementImage(
  () => props.image
);

watchEffect(() => {
  isHovered.value ? loadImage() : unloadImage();
});

const textColor = useContrastColor(() => props.color);
</script>

<style lang="scss" scoped>
.image-item {
  height: 150px;
  background-color: v-bind("color");

  img {
    object-fit: cover;
  }
}
</style>
