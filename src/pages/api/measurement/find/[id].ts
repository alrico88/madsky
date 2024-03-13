import db from "@helpers/db";
import type { APIRoute } from "astro";
import { z } from "zod";

export const GET: APIRoute = async (event) => {
  const paramsSchema = z.object({
    id: z.number({ coerce: true }),
  });

  const { id } = paramsSchema.parse(event.params);
  const searchParams = event.url.searchParams;

  const orderSchema = z.enum(["prev", "next"]);
  const order = orderSchema.parse(searchParams.get("order"));

  const curr = await db.query.skyMeasurement.findFirst({
    where: (measurement, {eq}) => eq(measurement.id, id),
    columns: {
      createdAt: true,
    },
  });

  if (!curr) {
    throw new Error('measurement not found');
  }

  const data = await db.query.skyMeasurement.findFirst({
    columns: {
      id: true,
    },
    where: (measurement, {gt, lt}) => order === 'next' ? gt(measurement.createdAt, curr.createdAt) : lt(measurement.createdAt, curr.createdAt),
    orderBy: (measurements, {asc, desc}) => order === 'next' ? asc(measurements.createdAt) : desc(measurements.createdAt),
  });

  return Response.json(data);
};
