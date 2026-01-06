import dayjs from "dayjs";

export function useDayScroll() {
  const dayScrolled = ref<null | Date>(null);

  const dayScrolledText = computed(() =>
    dayScrolled.value
      ? dayjs(dayScrolled.value).format("ddd DD MMM YYYY")
      : null
  );

  function handleHover(date: Date) {
    dayScrolled.value = date;
  }

  function handleReset() {
    dayScrolled.value = null;
  }

  return {
    dayScrolled,
    handleHover,
    handleReset,
    dayScrolledText,
  };
}
