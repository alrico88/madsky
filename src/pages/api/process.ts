import db from "@helpers/db";
import { getImageDetails } from "@root/processing/image";
import { uploadMeasurementImage } from "@root/processing/upload";
import { measurementWeather, skyMeasurement } from "@root/schema";
import { getWeather } from "@services/weather";
import type { APIRoute } from "astro";

export const GET: APIRoute = async (c) => {
  if (c.url.searchParams.get("key") !== process.env.PROCESS_KEY) {
    return new Response(
      JSON.stringify({
        result: "error",
        error: "not authorized",
      }),
      {
        status: 401,
      }
    );
  }

  try {
    const { imageUUID, image, avgColor } = await getImageDetails(
      process.env.IMAGE_URL as string
    );

    const weather = await getWeather(
      Number(process.env.LOCATION_LAT),
      Number(process.env.LOCATION_LON)
    );

    const rows = await db
      .insert(skyMeasurement)
      .values({
        averageColor: avgColor,
        image: imageUUID,
      })
      .returning({
        id: skyMeasurement.id,
      });

    await db.insert(measurementWeather).values({
      skyMeasurementId: rows[0].id,
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
    });

    await uploadMeasurementImage(imageUUID, image);

    return new Response(
      JSON.stringify({
        result: "success",
      })
    );
  } catch (err) {
    console.error(err);

    return new Response(
      JSON.stringify({
        result: "error",
        error: err,
      }),
      {
        status: 500,
      }
    );
  }
};
