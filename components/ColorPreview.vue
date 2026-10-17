<template lang="pug">
u-tooltip(text="Copiar color", arrow)
  u-button.bg-color.font-mono.opacify(
    color="neutral",
    variant="outline",
    :ui="{ base: 'ring-current focus-visible:outline-current' }",
    @click.stop="() => copy()"
  ) {{ color }}
</template>

<script setup lang="ts">
const props = defineProps<{
  color: string;
  textColor: string;
}>();

const { copy, copied } = useClipboard({
  source: () => props.color,
});

const toast = useToast();

whenever(copied, () => {
  toast.add({ title: "Color copiado al portapapeles", color: "success" });
});
</script>

<style lang="scss" scoped>
.bg-color {
  background-color: v-bind("color");
  color: v-bind("textColor");
  outline-color: v-bind("textColor");
  --tw-ring-color: v-bind("textColor");
}
</style>
