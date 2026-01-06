<template lang="pug">
.fixed.bg-dark.text-white.p-4.rounded.shadow-sm(
  v-if="text && show",
  class="right-[10px] top-[50vh]"
) {{ text }}
</template>

<script setup lang="ts">
const props = defineProps<{
  text?: string | null;
}>();

const show = ref(false);

const hide = useDebounceFn(() => {
  show.value = false;
}, 1000);

const { isScrolling } = useScroll(window);

watch(isScrolling, (val) => {
  if (val) {
    show.value = true;
  } else {
    hide();
  }
});
</script>
