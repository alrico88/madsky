import type { ShallowRef } from "vue";
import { useWindowScroll, useWindowSize } from "@vueuse/core";

export function useDayScroll(target: Readonly<ShallowRef<HTMLElement | null>>) {
  const dayScrolled = shallowRef<string | null>(null);
  const { y, isScrolling } = useWindowScroll({ idle: 1000 });
  const { width, height } = useWindowSize();
  const formatter = new Intl.DateTimeFormat("es-ES", {
    timeZone: "Europe/Madrid",
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  function updateDay() {
    const container = target.value;
    if (!container) return;

    const bounds = container.getBoundingClientRect();
    const element = document.elementFromPoint(
      Math.max(0, Math.min(width.value - 1, bounds.left + bounds.width / 2)),
      height.value / 2
    );
    const measurement = element?.closest<HTMLElement>("[data-measurement-date]");
    dayScrolled.value = measurement && container.contains(measurement)
      ? measurement.dataset.measurementDate ?? null
      : null;
  }

  watch([y, width, height, target], updateDay, { flush: "post" });

  const dayScrolledText = computed(() =>
    dayScrolled.value ? formatter.format(new Date(dayScrolled.value)) : null
  );

  return { dayScrolledText, isScrolling };
}
