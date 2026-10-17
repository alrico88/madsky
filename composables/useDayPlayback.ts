import { computed, shallowRef, watch } from "vue";
import type { Ref } from "vue";
import { useDocumentVisibility, useIntervalFn } from "@vueuse/core";

const SPEEDS = [0.5, 1, 2] as const;
const BASE_INTERVAL = 1200;

export function useDayPlayback(sampleCount: Readonly<Ref<number>>) {
  const index = shallowRef(0);
  const speed = shallowRef<(typeof SPEEDS)[number]>(1);
  const interval = computed(() => BASE_INTERVAL / speed.value);
  const visibility = useDocumentVisibility();
  const { pause, resume, isActive } = useIntervalFn(
    () => {
      if (index.value >= sampleCount.value - 1) {
        pause();
        return;
      }

      index.value += 1;
    },
    interval,
    { immediate: false }
  );

  watch(sampleCount, (count) => {
    index.value = Math.min(index.value, Math.max(0, count - 1));
    if (count < 2) pause();
  });

  watch(speed, () => {
    if (isActive.value) {
      pause();
      resume();
    }
  });

  watch(visibility, (value) => {
    if (value !== "visible") pause();
  });

  function play() {
    if (sampleCount.value < 2 || visibility.value !== "visible") return;
    if (index.value >= sampleCount.value - 1) index.value = 0;
    resume();
  }

  function seek(nextIndex: number) {
    index.value = Math.min(
      Math.max(0, Math.trunc(nextIndex)),
      Math.max(0, sampleCount.value - 1)
    );
  }

  function setSpeed(value: number) {
    if (SPEEDS.includes(value as (typeof SPEEDS)[number])) {
      speed.value = value as (typeof SPEEDS)[number];
    }
  }

  return { index, speed, isPlaying: isActive, play, pause, seek, setSpeed };
}
