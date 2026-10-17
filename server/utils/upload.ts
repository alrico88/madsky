const runtimeConfig = useRuntimeConfig();

export async function uploadMeasurementImage(
  id: string,
  content: Uint8Array
): Promise<void> {
  const endpoint = runtimeConfig.webdavEndpoint as string;
  const username = runtimeConfig.webdavUsername as string;
  const password = runtimeConfig.webdavPassword as string;

  if (!endpoint || !username || !password) {
    throw new Error("Missing WebDAV credentials for image upload.");
  }

  const baseUrl = endpoint.endsWith("/") ? endpoint : `${endpoint}/`;
  const targetUrl = `${baseUrl}${id}.jpeg`;
  const auth = Buffer.from(`${username}:${password}`, "utf8").toString(
    "base64"
  );

  await $fetch(targetUrl, {
    method: "PUT",
    body: content,
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "image/jpeg",
    },
  });
}
