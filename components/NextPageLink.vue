<template lang="pug">
.py-4.text-center
  nuxt-link(:to="url", @click="scrollToTop") Siguiente página
</template>

<script setup lang="ts">
const props = defineProps<{
  url: {
    name: string;
    query: {
      page: number;
    };
  };
}>();

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>
