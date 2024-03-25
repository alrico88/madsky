import sharp from "sharp";
import { nanoid } from "nanoid";
import { getAverageColor } from "fast-average-color-node";

async function getAvgColor(imgBuffer: ArrayBuffer): Promise<string> {
  const decoded = sharp(imgBuffer);

  const { width, height } = await decoded.metadata();
  const cropped = decoded.extract({
    top: 0,
    left: 0,
    width: width as number,
    height: (height as number) / 2,
  });
  const avgColor = await getAverageColor(await cropped.toBuffer());

  return avgColor.hex;
}

async function getResizedImage(imgBuffer: ArrayBuffer): Promise<Uint8Array> {
  const decoded = sharp(imgBuffer);

  const resized = decoded.resize(null, 500);

  return await resized.jpeg().toBuffer();
}

export async function getImageDetails(url: string): Promise<{
  imageUUID: string;
  avgColor: string;
  image: Uint8Array;
}> {
  const imageUUID = nanoid(12);
  const res = await fetch(url);
  const img = await res.arrayBuffer();

  const [avgColor, resizedImage] = await Promise.all([
    getAvgColor(img),
    getResizedImage(img),
  ]);

  return {
    imageUUID,
    avgColor,
    image: resizedImage,
  };
}
