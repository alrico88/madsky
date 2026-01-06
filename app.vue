<template lang="pug">
div(class="text-[14px] md:text-[19px]")
  vite-pwa-manifest
  nuxt-loading-indicator
  nuxt-layout
    nuxt-page
    toaster(position="bottom-center", theme="dark", rich-colors)
</template>

<style>
html,
body {
  font-family: "Noto Sans", sans-serif;
}
</style>
