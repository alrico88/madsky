<template lang="pug">
u-app(
  :locale="es",
  :toaster="{ position: 'bottom-center' }",
  class="text-[14px] md:text-[19px]"
)
  vite-pwa-manifest
  nuxt-loading-indicator
  nuxt-layout
    nuxt-page
</template>

<script setup lang="ts">
import { es } from "@nuxt/ui/locale";
</script>

<style>
html,
body {
  font-family: "Noto Sans", sans-serif;
}
</style>
