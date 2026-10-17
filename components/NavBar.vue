<template lang="pug">
u-header.site-header(
  title="MADSKY",
  :ui="{ root: 'static border-0 backdrop-blur-none', container: 'max-w-none px-3 sm:px-3 lg:px-3', title: 'title-font', toggle: 'text-inverted hover:bg-inverted/20' }"
)
  template(#right)
    u-navigation-menu.desktop-menu.hidden(
      class="lg:flex",
      :items="items",
      color="neutral",
      aria-label="Vistas de MADSKY",
      :ui="{ linkLabel: 'sr-only', link: 'p-3', linkLeadingIcon: 'size-6' }"
    )
      template(#item="{ item }")
        u-tooltip(:text="item.label", arrow)
          span.flex
            u-icon.size-6(:name="item.icon", aria-hidden="true")
            span.sr-only {{ item.label }}
  template(#body)
    u-navigation-menu(
      :items="items",
      orientation="vertical",
      color="neutral",
      aria-label="Vistas de MADSKY"
    )
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const items: NavigationMenuItem[] = [
  { label: "Vista de rejilla", to: "/", icon: "i-tabler-table", exact: true },
  { label: "Vista de lista", to: "/list", icon: "i-tabler-layout-rows" },
  { label: "Colores por día", to: "/days", icon: "i-tabler-calendar-week" },
  { label: "Un año de cielo", to: "/year", icon: "i-tabler-calendar" },
  { label: "Buscar por color", to: "/colors", icon: "i-tabler-palette" },
  { label: "Acerca del proyecto", to: "/about", icon: "i-tabler-info-circle" },
];
</script>

<style lang="scss">
.site-header {
  background: rgb(33, 37, 41);

  .title-font {
    font-family: "Bungee", "Helvetica Neue", Helvetica, sans-serif;
    font-size: 1.5rem;
    font-weight: 400;
    letter-spacing: 0.1rem;
    background: linear-gradient(to right, #c8cfd5, #9cc2e3);
    background-clip: text;
    color: transparent;
  }

  .desktop-menu {
    [data-slot="link"] {
      color: #fff;

      &::before {
        background: transparent;
      }

      &:hover::before,
      &[data-active]::before {
        background: #475569;
      }
    }
  }
}
</style>
