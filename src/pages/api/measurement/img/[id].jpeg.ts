import type { APIRoute } from "astro";
import { $fetch } from "ofetch";
import { z } from "zod";

export const GET: APIRoute = async (event) => {
  const paramsSchema = z.object({
    id: z.string(),
  });

  const { id } = paramsSchema.parse(event.params);

  try {
    const img = await $fetch(
      `https://${process.env.MEASUREMENT_IMAGE_URL}/${id}.jpeg`,
      {
        responseType: "arrayBuffer",
      }
    );

    return new Response(img, {
      status: 200,
      headers: {
        contentType: "image/jpeg",
      },
    });
  } catch (err) {
    return new Response(null, {
      status: 404,
    });
  }
};
