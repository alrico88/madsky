import {
  PutObjectCommand,
  type PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";

const client = new S3Client({
  region: "auto",
  endpoint: process.env.S3_ENDPOINT as string,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY as string,
    secretAccessKey: process.env.S3_SECRET_KEY as string,
  },
});

export async function uploadMeasurementImage(
  id: string,
  content: Uint8Array
): Promise<void> {
  const uploadParams: PutObjectCommandInput = {
    Bucket: "madsky-storage",
    Key: `${id}.jpeg`,
    Body: content,
  };

  const cmd = new PutObjectCommand(uploadParams);

  await client.send(cmd);
}
