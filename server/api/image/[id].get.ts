import { $fetch } from "ofetch";
import { z } from "zod";

const runtimeConfig = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const paramsSchema = z.object({
    id: z.coerce.string(),
  });

  const { id } = await getValidatedRouterParams(event, paramsSchema.parse);

  try {
    const img = await $fetch(
      `https://${runtimeConfig.measurementImageUrl}/${id}.jpeg`,
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
    console.error(err);

    return new Response(null, {
      status: 404,
    });
  }
});
