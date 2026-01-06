<template lang="pug">
tippy(:content="title", arrow)
  nuxt-link.text-white.p-2.rounded-lg.flex.items-center.block(
    :to="url",
    :title="title",
    :class="linkBg"
  )
    icon(:name="iconName", size="25")
</template>

<script setup lang="ts">
import { Tippy } from "vue-tippy";

const props = defineProps<{
  title: string;
  url: string;
  iconName: string;
}>();

const route = useRoute();

const isCurrentLink = computed(() => route.path === props.url);

const linkBg = computed(() => ({
  "bg-slate-600": isCurrentLink.value,
}));
</script>
