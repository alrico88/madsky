<template lang="pug">
nav-bar
.container.py-4.mx-auto.gap-3.flex.flex-col.px-3
  section
    h5.fw-bold.mb-2 Créditos
    p.mb-2 Este proyecto está hecho por #[nuxt-link(:to="portfolioLink", v-bind="linkProps") Alberto Rico].
    p.mb-2 Está inspirado en #[nuxt-link(:to="inspirationLink", v-bind="linkProps") NSKYC] 
    p.mb-2 Foto tomada por:
    ul.list-disc.pl-6.mb-2
      li
        nuxt-link(to="https://www.madridskyline.net", v-bind="linkProps") madridskyline.net
      li
        nuxt-link(to="https://meteosierra.com", v-bind="linkProps") meteosierra.com
    p.mb-0 Datos del tiempo desde #[nuxt-link(:to="weatherLink", v-bind="linkProps") OpenMeteo]
  section
    h5.fw-bold.mb-2 Tecnologías utilizadas:
    ul.list-disc.pl-6.mb-2
      li #[icon(name="logos:nuxt-icon")] #[nuxt-link(to="https://nuxt.com") Nuxt 4]
      li #[icon(name="material-symbols:package-2-outline-sharp")] #[nuxt-link(to="https://sharp.pixelplumbing.com") Sharp]
      li #[icon(name="logos:drizzle")] #[nuxt-link(to="https://orm.drizzle.team") Drizzle ORM]
      li #[icon(name="logos:aws-s3")] #[nuxt-link(to="https://www.min.io/") min.io]
  section
    donate-button
</template>

<script setup lang="ts">
defineRouteRules({
  prerender: true,
});

useSeoMeta({
  title: "Acerca de MADSKY",
  description: "Descubre lo que hay detrás de esta web",
});

const portfolioLink = "https://alrico.es";
const inspirationLink = "https://nskyc.com";
const weatherLink = "https://open-meteo.com";

const linkProps = {
  target: "_blank",
};
</script>

<style lang="scss" scoped>
a {
  color: rgb(29, 111, 234) !important;
  text-decoration: underline !important;
}
</style>
