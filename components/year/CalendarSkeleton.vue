<template lang="pug">
div(role="status", aria-live="polite")
  span.sr-only Cargando el calendario…
  .grid.gap-x-6.gap-y-7(aria-hidden="true", class="sm:grid-cols-2 lg:grid-cols-3")
    .min-w-0(v-for="month in 12", :key="month")
      u-skeleton.mb-3.h-5.w-24
      .grid.grid-cols-7(class="gap-[0.22rem]")
        u-skeleton.h-5(v-for="weekday in 7", :key="`weekday-${weekday}`")
        u-skeleton.aspect-square(
          v-for="day in 42",
          :key="day",
          class="rounded-[0.2rem]"
        )
</template>
