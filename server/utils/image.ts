import sharp from "sharp";
import { nanoid } from "nanoid";
import { getAverageColor } from "fast-average-color-node";

const runtimeConfig = useRuntimeConfig();

async function getAvgColor(imgBuffer: ArrayBuffer): Promise<string> {
  const decoded = sharp(imgBuffer);

  const cropped = decoded.extract({
    top: runtimeConfig.imageTop as number,
    left: runtimeConfig.imageLeft as number,
    width: runtimeConfig.imageWidth as number,
    height: runtimeConfig.imageHeight as number,
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
  const img = await $fetch(url, {
    referrer: runtimeConfig.imageReferrer,
    responseType: "arrayBuffer",
  });

  const [avgColor, resizedImage] = await Promise.all([
    getAvgColor(img as ArrayBuffer),
    getResizedImage(img as ArrayBuffer),
  ]);

  return {
    imageUUID,
    avgColor,
    image: resizedImage,
  };
}
