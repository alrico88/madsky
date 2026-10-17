import chroma from "chroma-js";
import suncalc from "suncalc";
import { z } from "zod";
import { madridDateKey, madridMidnight } from "../../utils/madrid";

const YEAR_QUERY = z
  .string()
  .regex(/^\d{4}$/, "El año debe tener cuatro cifras")
  .transform(Number)
  .pipe(z.number().int().min(2000).max(2100))
  .optional();

export default defineEventHandler(async (event) => {
  const { year: requestedYear } = await getValidatedQuery(event, (query) =>
    z.object({ year: YEAR_QUERY }).parse(query)
  );

  const [earliest, latest] = await Promise.all([
    db.query.skyMeasurement.findFirst({
      columns: { createdAt: true },
      orderBy: (measurement, { asc }) => asc(measurement.createdAt),
    }),
    db.query.skyMeasurement.findFirst({
      columns: { createdAt: true },
      orderBy: (measurement, { desc }) => desc(measurement.createdAt),
    }),
  ]);

  const minYear = earliest
    ? Number(madridDateKey(earliest.createdAt).slice(0, 4))
    : null;
  const maxYear = latest
    ? Number(madridDateKey(latest.createdAt).slice(0, 4))
    : null;
  const year =
    requestedYear ?? maxYear ?? Number(madridDateKey(new Date()).slice(0, 4));
  const startDate = `${year}-01-01`;
  const endDate = `${year + 1}-01-01`;
  const start = madridMidnight(startDate);
  const end = madridMidnight(endDate);

  const measurements = await db.query.skyMeasurement.findMany({
    columns: { createdAt: true, averageColor: true },
    where: (measurement, { and, gte, lt }) =>
      and(gte(measurement.createdAt, start), lt(measurement.createdAt, end)),
    orderBy: (measurement, { asc }) => asc(measurement.createdAt),
  });

  const [latitude, longitude] =
    useRuntimeConfig(event).public.measurementsLocation;
  const colorsByDay = new Map<string, string[]>();
  for (const measurement of measurements) {
    const position = suncalc.getPosition(
      measurement.createdAt,
      Number(latitude),
      Number(longitude)
    );
    if (
      position.altitude <= 0 ||
      !/^#[0-9a-f]{6}$/i.test(measurement.averageColor)
    )
      continue;

    const date = madridDateKey(measurement.createdAt);
    const colors = colorsByDay.get(date) ?? [];
    colors.push(measurement.averageColor);
    colorsByDay.set(date, colors);
  }

  const isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = Array.from({ length: isLeapYear ? 366 : 365 }, (_, index) => {
    const date = new Date(Date.UTC(year, 0, index + 1))
      .toISOString()
      .slice(0, 10);
    const colors = colorsByDay.get(date);

    return {
      date,
      color: colors ? chroma.average(colors, "rgb").hex() : null,
      count: colors?.length ?? 0,
    };
  });

  return { year, minYear, maxYear, days };
});
