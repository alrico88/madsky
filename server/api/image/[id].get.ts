import { $fetch } from "ofetch";
import { z } from "zod";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();

  const paramsSchema = z.object({
    id: z.coerce.string(),
  });

  const { id } = await getValidatedRouterParams(event, paramsSchema.parse);

  try {
    const endpoint = runtimeConfig.measurementImageUrl as string;
    if (!endpoint) return new Response(null, { status: 404 });
    const baseUrl = /^https?:\/\//.test(endpoint)
      ? endpoint
      : `https://${endpoint}`;
    const imageUrl = baseUrl.endsWith("/")
      ? `${baseUrl}${id}.jpeg`
      : `${baseUrl}/${id}.jpeg`;

    const img = await $fetch(imageUrl, {
      responseType: "arrayBuffer",
    });

    return new Response(img, {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg",
      },
    });
  } catch (err) {
    console.error(err);

    return new Response(null, {
      status: 404,
    });
  }
});
