import type { APIRoute } from "astro";
import prisma from "@helpers/prisma";
import { z } from "zod";

export const GET: APIRoute = async (event) => {
  const paramsSchema = z.object({
    id: z.number({ coerce: true }),
  });

  const { id } = paramsSchema.parse(event.params);

  const data = await prisma.skyMeasurement.findFirst({
    where: {
      id,
    },
    select: {
      image: true,
    },
  });

  return Response.json(data, {
    headers: {
      "Cache-Control": "max-age=86400",
    },
  });
};
