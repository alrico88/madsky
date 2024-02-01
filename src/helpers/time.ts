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
