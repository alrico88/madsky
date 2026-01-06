import is from "@sindresorhus/is";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();

  const { key } = getQuery(event);

  if (key !== runtimeConfig.PROCESS_KEY) {
    setResponseStatus(event, 401);

    return {
      result: "error",
      error: "not authorized",
    };
  }

  try {
    const { imageUUID, image, avgColor } = await getImageDetails(
      runtimeConfig.imageUrl as string
    );

    const weather = await getWeather(
      Number(runtimeConfig.locationLat),
      Number(runtimeConfig.locationLon)
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

    if (!is.nonEmptyArray(rows)) {
      return;
    }

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

    return {
      result: "success",
    };
  } catch (err) {
    console.error(err);

    setResponseStatus(event, 500);

    return {
      result: "error",
      error: err,
    };
  }
});
