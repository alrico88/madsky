import type { APIRoute } from "astro";
import prisma from "../../../../helpers/prisma";
import { z } from "zod";

export const GET: APIRoute = async (event) => {
  const paramsSchema = z.object({
    id: z.number({ coerce: true }),
  });

  const { id } = paramsSchema.parse(event.params);
  const searchParams = event.url.searchParams;

  const orderSchema = z.enum(["prev", "next"]);
  const order = orderSchema.parse(searchParams.get("order"));

  const curr = await prisma.skyMeasurement.findFirstOrThrow({
    where: {
      id,
    },
    select: {
      created_at: true,
    },
  });

  const data = await prisma.skyMeasurement.findFirst({
    where: {
      created_at: {
        [order === "next" ? "gt" : "lt"]: curr.created_at,
      },
    },
    select: {
      id: true,
    },
    orderBy: {
      created_at: order === "next" ? "asc" : "desc",
    },
  });

  return Response.json(data);
};
