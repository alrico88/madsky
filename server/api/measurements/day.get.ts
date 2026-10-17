import { z } from "zod";
import {
  addMadridDays,
  isMadridDateKey,
  madridMidnight,
} from "../../utils/madrid";

export default defineEventHandler(async (event) => {
  const querySchema = z.object({
    date: z.string().refine(isMadridDateKey, "Fecha inválida"),
  });
  const { date } = await getValidatedQuery(event, (query) =>
    querySchema.parse(query)
  );

  const measurements = await db.query.skyMeasurement.findMany({
    columns: {
      id: true,
      createdAt: true,
      averageColor: true,
    },
    where: (measurement, { and, gte, lt }) =>
      and(
        gte(measurement.createdAt, madridMidnight(date)),
        lt(measurement.createdAt, madridMidnight(addMadridDays(date, 1)))
      ),
    orderBy: (measurement, { asc }) => asc(measurement.createdAt),
    with: {
      weather: {
        columns: {
          temperature: true,
          feelsLike: true,
          weatherCode: true,
          cloudCover: true,
          rain: true,
        },
      },
    },
  });

  return { date, measurements };
});
