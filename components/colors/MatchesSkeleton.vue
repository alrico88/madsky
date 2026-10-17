<template lang="pug">
.mt-4(role="status", aria-live="polite")
  span.sr-only Buscando en las mediciones del cielo…
  div(aria-hidden="true")
    u-skeleton.mb-3.h-4.w-64.max-w-full
    .flex.items-center.gap-4.border-b.border-default.py-3(
      v-for="match in 12",
      :key="match"
    )
      u-skeleton.size-11.shrink-0.rounded-xl(class="sm:size-13")
      .min-w-0.flex-1.space-y-2
        u-skeleton.h-4.w-20
        u-skeleton.h-3.w-64.max-w-full
      .shrink-0.space-y-2
        u-skeleton.h-3.w-20
        u-skeleton.h-3.w-14
</template>
