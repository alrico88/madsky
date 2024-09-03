import dayjs from "dayjs";
import "dayjs/locale/es";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import timeZone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.extend(timeZone);
dayjs.locale("es");

export const customDayJs = dayjs;

export const tz = "Europe/Madrid";

export const MINUTES_IN_A_DAY = 60 * 24;
export const SNAPSHOTS_IN_A_DAY = MINUTES_IN_A_DAY / 10;
export const SNAPSHOTS_IN_A_WEEK = SNAPSHOTS_IN_A_DAY * 7;

export function nextDivisibleBy10(date: Date): Date {
  const minutes = date.getMinutes();
  let nextMinutes = Math.ceil(minutes / 10) * 10;

  if (nextMinutes === minutes) {
    nextMinutes += 10;
  }

  if (nextMinutes === 60) {
    date.setHours(date.getHours() + 1);
    date.setMinutes(0);
  } else {
    date.setMinutes(nextMinutes);
  }

  date.setSeconds(0, 0);
  return date;
}

export function getCacheTTL(): number {
  const nextUpdate = nextDivisibleBy10(new Date());

  return dayjs(nextUpdate).diff(dayjs(), "seconds");
}
