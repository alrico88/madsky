import { Unit, convertToMilliseconds } from "espera";
import dayjs from "dayjs";
import "dayjs/locale/es";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
dayjs.locale("es");

export function useTime(watchSrc: MaybeRefOrGetter<string | Date>) {
  const timeAgo = ref("");
  const src = toRef(watchSrc);

  const now = useNow({
    interval: convertToMilliseconds(1, Unit.minutes),
  });

  const isMidnight = computed(
    () => dayjs(src.value).format("HH:mm") === "00:00"
  );
  const formattedDayTag = computed(() =>
    dayjs(src.value).format("ddd DD HH:mm")
  );

  watch(
    now,
    () => {
      const parsedDate = dayjs(src.value);
      const time = parsedDate.format("HH:mm");

      if (isMidnight.value) {
        timeAgo.value = parsedDate.format("ddd DD HH:mm");

        return;
      }

      const diff = dayjs().diff(src.value, "minutes");

      if (diff > 60) {
        timeAgo.value = time;
      } else {
        timeAgo.value = parsedDate.fromNow();
      }
    },
    {
      immediate: true,
    }
  );

  return {
    timeAgo,
    isMidnight,
    formattedDayTag,
  };
}
