<template lang="pug">
.bg-navbar.flex.p-3.items-center
  nuxt-link.title-font(to="/") MADSKY
  .ml-auto.flex.gap-2
    nav-bar-link(
      url="/",
      title="Vista de rejilla",
      icon-name="ic:twotone-grid-on"
    )
    nav-bar-link(
      url="/list",
      title="Vista de lista",
      icon-name="ic:twotone-table-rows"
    )
    .p-2.flex.justify-center
      .border-r-1.border-solid.border-slate-600
    nav-bar-link(
      url="/about",
      title="Acerca del proyecto",
      icon-name="tabler:info-circle"
    )
</template>

<style lang="scss" scoped>
.title-font {
  font-family: "Bungee", "Helvetica Neue", Helvetica, sans-serif;
  letter-spacing: 0.1rem;
  background-image: linear-gradient(to right, #c8cfd5, #9cc2e3);
  transition: color 0.5s ease-in-out;
  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  font-size: 1.5rem;
}

.bg-navbar {
  background-color: rgb(33, 37, 41);
}
</style>
