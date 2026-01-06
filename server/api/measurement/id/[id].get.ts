import { z } from "zod";

export default defineCachedEventHandler(
  async (event) => {
    const paramsSchema = z.object({
      id: z.coerce.number(),
    });

    const { id } = await getValidatedRouterParams(event, (params) =>
      paramsSchema.parse(params)
    );

    const measurementData = await db.query.skyMeasurement.findFirst({
      where: (measurement, { eq }) => eq(measurement.id, id),
      with: {
        weather: true,
      },
    });

    return measurementData;
  },
  {
    swr: true,
    maxAge: 600,
  }
);
