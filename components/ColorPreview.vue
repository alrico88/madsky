<template lang="pug">
tippy(content="Copiar color", arrow)
  button.bg-color.p-2.border.border-solid.rounded-md.text-sm.font-mono.opacify(
    @click.stop="() => copy()"
  ) {{ color }}
</template>

<script setup lang="ts">
import { Tippy } from "vue-tippy";
const props = defineProps<{
  color: string;
  textColor: string;
}>();

const { copy, copied } = useClipboard({
  source: () => props.color,
});

const { $toast } = useNuxtApp();

whenever(copied, () => {
  $toast.success("Color copiado al portapapeles");
});
</script>

<style lang="scss" scoped>
.bg-color {
  background-color: v-bind("color");
  border-color: v-bind("textColor") !important;
  color: v-bind("textColor");
}
</style>
