import chroma from "chroma-js";
import { sql } from "drizzle-orm";
import { z } from "zod";
import db from "../../utils/db";
import { skyMeasurement } from "../../utils/schema";

const HEX_COLOR_PATTERN = "^#[0-9a-f]{6}$";
const SHORTLIST_SIZE = 80;

const querySchema = z.object({
  color: z.string().regex(/^#[\da-f]{6}$/i, "Color inválido"),
  limit: z.coerce.number().int().min(1).max(30).default(12),
});

export default defineEventHandler(async (event) => {
  const { color, limit } = await getValidatedQuery(event, (query) =>
    querySchema.parse(query)
  );
  const normalizedColor = color.toUpperCase();
  const [red, green, blue] = chroma(normalizedColor).rgb();

  const rgbDistance = sql<number>`(
    power(get_byte(decode(substr(${skyMeasurement.averageColor}, 2, 2), 'hex'), 0) - ${red}, 2) +
    power(get_byte(decode(substr(${skyMeasurement.averageColor}, 4, 2), 'hex'), 0) - ${green}, 2) +
    power(get_byte(decode(substr(${skyMeasurement.averageColor}, 6, 2), 'hex'), 0) - ${blue}, 2)
  )`;

  const shortlist = await db
    .select({
      id: skyMeasurement.id,
      createdAt: skyMeasurement.createdAt,
      averageColor: skyMeasurement.averageColor,
    })
    .from(skyMeasurement)
    .where(
      sql`CASE WHEN ${skyMeasurement.averageColor} ~* ${HEX_COLOR_PATTERN} THEN TRUE ELSE FALSE END`
    )
    .orderBy(
      sql`CASE WHEN ${skyMeasurement.averageColor} ~* ${HEX_COLOR_PATTERN} THEN ${rgbDistance} ELSE NULL END`,
      sql`${skyMeasurement.id} DESC`
    )
    .limit(SHORTLIST_SIZE);

  const results = shortlist
    .map((measurement) => ({
      ...measurement,
      distance: chroma.deltaE(normalizedColor, measurement.averageColor),
    }))
    .sort((a, b) => a.distance - b.distance || b.id - a.id)
    .slice(0, limit);

  return { color: normalizedColor, results };
});
