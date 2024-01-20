import { customDayJs as dayjs, tz } from "@helpers/time";
import { createSignal, type Component, createEffect, on } from "solid-js";
import { useNow } from "solidjs-use";

interface TimeAgoProps {
  date: Date;
  isMidnight: boolean;
}

export const TimeAgo: Component<TimeAgoProps> = (props) => {
  const [timeAgo, setTimeAgo] = createSignal("");

  const now = useNow({
    interval: 1000,
  });

  createEffect(
    on(now, () => {
      const parsed = dayjs(props.date).tz(tz);

      if (props.isMidnight) {
        setTimeAgo(parsed.format("ddd DD, HH:mm"));

        return;
      }

      const diff = dayjs().diff(props.date, "minutes");

      if (diff > 60) {
        setTimeAgo(parsed.format("HH:mm"));
      } else {
        setTimeAgo(parsed.fromNow());
      }
    })
  );

  return <div class="div">{timeAgo()}</div>;
};
