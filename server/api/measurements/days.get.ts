import { z } from "zod";
import { and, asc, desc, eq, gte, inArray, lt, sql } from "drizzle-orm";
import db from "../../utils/db";
import { skyMeasurement, measurementWeather } from "../../utils/schema";
import {
  madridDateKey,
  addMadridDays,
  madridMidnight,
} from "../../utils/madrid";

const DAYS_PER_PAGE = 90;
export default defineEventHandler(async (event) => {
  const querySchema = z.object({
    page: z.coerce.number().int().min(0).max(100000).default(0),
    weather: z.enum(["all", "rain", "dry", "cloudy", "clear"]).default("all"),
  });
  const { page, weather } = await getValidatedQuery(event, (query) =>
    querySchema.parse(query)
  );
  // Stored timestamps are UTC without a timezone; group by the local Madrid day.
  const localDay = sql<string>`to_char((${skyMeasurement.createdAt} AT TIME ZONE 'UTC') AT TIME ZONE 'Europe/Madrid', 'YYYY-MM-DD')`;
  let days: string[];
  let hasNext: boolean;

  if (weather !== "all") {
    const conditions = {
      rain: sql`max(${measurementWeather.rain}) > 0`,
      dry: sql`count(${measurementWeather.rain}) > 0 AND max(${measurementWeather.rain}) = 0`,
      cloudy: sql`avg(${measurementWeather.cloudCover}) >= 70`,
      clear: sql`avg(${measurementWeather.cloudCover}) <= 20`,
    };
    const matchingDays = await db
      .select({ date: localDay })
      .from(skyMeasurement)
      .leftJoin(
        measurementWeather,
        eq(measurementWeather.skyMeasurementId, skyMeasurement.id)
      )
      .groupBy(localDay)
      .having(conditions[weather])
      .orderBy(desc(localDay))
      .limit(DAYS_PER_PAGE + 1)
      .offset(page * DAYS_PER_PAGE);
    hasNext = matchingDays.length > DAYS_PER_PAGE;
    days = matchingDays
      .slice(0, DAYS_PER_PAGE)
      .map((day) => day.date)
      .reverse();
  } else {
    const [latest, earliest] = await Promise.all([
      db.query.skyMeasurement.findFirst({
        columns: { createdAt: true },
        orderBy: (measurement) => desc(measurement.createdAt),
      }),
      db.query.skyMeasurement.findFirst({
        columns: { createdAt: true },
        orderBy: (measurement) => asc(measurement.createdAt),
      }),
    ]);
    if (!latest || !earliest)
      return { days: [], measurements: [], hasNext: false };
    const endDay = addMadridDays(
      madridDateKey(latest.createdAt),
      -page * DAYS_PER_PAGE
    );
    const startDay = addMadridDays(endDay, -(DAYS_PER_PAGE - 1));
    days = Array.from({ length: DAYS_PER_PAGE }, (_, index) =>
      addMadridDays(startDay, index)
    );
    hasNext = madridDateKey(earliest.createdAt) < startDay;
  }

  if (!days.length) return { days: [], measurements: [], hasNext: false };
  const measurements = await db.query.skyMeasurement.findMany({
    columns: { createdAt: true, averageColor: true },
    with: { weather: { columns: { cloudCover: true, rain: true } } },
    where: and(
      gte(skyMeasurement.createdAt, madridMidnight(days[0])),
      lt(
        skyMeasurement.createdAt,
        madridMidnight(addMadridDays(days[days.length - 1], 1))
      ),
      weather !== "all" ? inArray(localDay, days) : undefined
    ),
    orderBy: (measurement) => asc(measurement.createdAt),
  });

  return { days, measurements, hasNext };
});
