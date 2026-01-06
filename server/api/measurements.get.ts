import db from "../utils/db";

export const MINUTES_IN_A_DAY = 60 * 24;
export const SNAPSHOTS_IN_A_DAY = MINUTES_IN_A_DAY / 10;
export const SNAPSHOTS_IN_A_WEEK = SNAPSHOTS_IN_A_DAY * 7;

export default defineCachedEventHandler<{
  query: {
    page?: number;
  };
}>(
  (event) => {
    const { page } = getQuery(event);

    return db.query.skyMeasurement.findMany({
      columns: {
        id: true,
        createdAt: true,
        averageColor: true,
        image: true,
      },
      orderBy: (measurement, { desc }) => desc(measurement.createdAt),
      limit: SNAPSHOTS_IN_A_WEEK,
      offset: SNAPSHOTS_IN_A_WEEK * Number(page),
    });
  },
  {
    swr: false,
    maxAge: 60,
  }
);
