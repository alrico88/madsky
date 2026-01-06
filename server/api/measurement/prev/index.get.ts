import is from "@sindresorhus/is";
import { Unit, convertToMilliseconds } from "espera";
import { z } from "zod";

export default defineCachedEventHandler(
  async (event) => {
    const querySchema = z.object({
      time: z.coerce.date(),
    });

    const { time } = await getValidatedQuery(event, (query) =>
      querySchema.parse(query)
    );

    const prev = await db.query.skyMeasurement.findFirst({
      where: (measurement, { lt }) => lt(measurement.createdAt, time),
      orderBy: (measurement, { desc }) => desc(measurement.createdAt),
      columns: {
        id: true,
      },
    });

    if (is.nullOrUndefined(prev)) {
      return null;
    }

    return prev.id;
  },
  {
    swr: false,
    maxAge: convertToMilliseconds(1, Unit.minutes) / 1000,
  }
);
