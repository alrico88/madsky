import {
  PutObjectCommand,
  type PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";

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

export async function uploadMeasurementImage(
  id: string,
  content: Uint8Array
): Promise<void> {
  const uploadParams: PutObjectCommandInput = {
    Bucket: "madsky",
    Key: `${id}.jpeg`,
    Body: content,
  };

  const cmd = new PutObjectCommand(uploadParams);

  await client.send(cmd);
}
