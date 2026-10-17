import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export async function uploadMeasurementImage(
  id: string,
  content: Uint8Array
): Promise<void> {
  const runtimeConfig = useRuntimeConfig();
  const client = new S3Client({
    region: "auto",
    forcePathStyle: true,
    endpoint: runtimeConfig.s3Endpoint as string,
    credentials: {
      accessKeyId: runtimeConfig.s3AccessKey as string,
      secretAccessKey: runtimeConfig.s3SecretKey as string,
    },
  });
  try {
    await client.send(
      new PutObjectCommand({
        Bucket: "madsky",
        Key: `${id}.jpeg`,
        Body: content,
      })
    );
  } finally {
    client.destroy();
  }
}
