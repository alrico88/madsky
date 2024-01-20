import { getAverageColor } from "fast-average-color-node";
import sharp from "sharp";
import { z } from "zod";
import { getWeather, type WeatherData } from "@services/weather";
import is from "@sindresorhus/is";
import type { APIRoute } from "astro";
import { $fetch } from "ofetch";
import prisma from "@helpers/prisma";
import { LOCATION_COORDS } from "@helpers/location";

async function getSkyMeasurement() {
  const imageUrl = "https://www.avendano.org/cam.jpg";

  const imageBuffer = await $fetch(imageUrl, {
    responseType: "arrayBuffer",
  });

  const image = sharp(imageBuffer);
  const { width, height } = await image.metadata();

  const skyPart = await image
    .extract({
      top: 0,
      left: 0,
      height: (height as number) / 2,
      width: width as number,
    })
    .toBuffer();

  const avgColor = await getAverageColor(skyPart, {
    mode: "precision",
  });

  let weather: undefined | WeatherData;

  try {
    const [lon, lat] = LOCATION_COORDS;
    weather = await getWeather(lat, lon);
  } catch (err) {
    console.error("Error getting weather", err);
  }

  await prisma.skyMeasurement.create({
    data: {
      average_color: avgColor.hex,
      image: (
        await sharp(imageBuffer)
          .resize({
            height: 500,
          })
          .toBuffer()
      ).toString("base64"),
      weather: is.nullOrUndefined(weather)
        ? weather
        : {
            create: {
              feelsLike: weather.feelsLike,
              cloudCover: weather.cloudCover,
              humidity: weather.humidity,
              precipitation: weather.precipitation,
              rain: weather.rain,
              snowfall: weather.snowfall,
              temperature: weather.temperature,
              uvIndex: weather.uvIndex,
              visibility: weather.visibility,
              windSpeed: weather.wind.speed,
              windDegrees: weather.wind.degrees,
              weatherCode: weather.code,
              pressure: weather.pressure,
            },
          },
    },
  });
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const processKey = process.env.PROCESS_KEY;

    const bodySchema = z.object({
      key: z.string(),
    });

    const { key } = bodySchema.parse(body);

    if (key !== processKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Invalid process key ${key}`,
        }),
        {
          status: 403,
        }
      );
    }

    await getSkyMeasurement();

    return new Response(
      JSON.stringify({
        success: true,
      })
    );
  } catch (err) {
    console.error(err);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Error processing image",
      }),
      {
        status: 500,
      }
    );
  }
};
