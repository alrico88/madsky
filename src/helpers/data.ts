import { madskyCache } from "./cache";
import { getCacheTTL, SNAPSHOTS_IN_A_WEEK } from "./time";
import db from "@helpers/db";
import { type skyMeasurementType } from "@root/schema";

export async function getPagePhotos(
  page: string
): Promise<skyMeasurementType[]> {
  let data: skyMeasurementType[] | undefined;

  const dataInCache = await madskyCache.getItem<skyMeasurementType[]>(
    `page_${page}`
  );

  if (Array.isArray(dataInCache) && dataInCache.length > 0) {
    data = dataInCache;
  } else {
    data = await db.query.skyMeasurement.findMany({
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

    madskyCache.setItem(`page_${page}`, data, {
      ttl: getCacheTTL(),
    });
  }

  return data;
}
