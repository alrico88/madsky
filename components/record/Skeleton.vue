<template lang="pug">
.space-y-4(role="status", aria-live="polite")
  span.sr-only Cargando el registro…
  .space-y-4(aria-hidden="true")
    u-card(:ui="{ body: 'p-3 sm:p-4' }")
      u-skeleton.w-full(class="h-[min(500px,70vw)]")
    u-card(v-for="fields in [2, 9, 3]", :key="fields")
      template(#header)
        u-skeleton.h-5.w-32
      .grid.gap-5(:class="fields === 2 ? 'sm:grid-cols-2' : 'md:grid-cols-3'")
        .space-y-3(v-for="field in fields", :key="field")
          u-skeleton.h-4.w-28
          u-skeleton.h-6.w-40.max-w-full
</template>
