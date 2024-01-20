import { $fetch } from "ofetch";

export interface WeatherResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: CurrentUnits;
  current: Current;
}

export interface CurrentUnits {
  time: string;
  interval: string;
  temperature_2m: string;
  relative_humidity_2m: string;
  apparent_temperature: string;
  is_day: string;
  precipitation: string;
  rain: string;
  showers: string;
  snowfall: string;
  weather_code: string;
  cloud_cover: string;
  surface_pressure: string;
  wind_speed_10m: string;
  wind_direction_10m: string;
  visibility: string;
  uv_index: string;
}

export interface Current {
  time: number;
  interval: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weather_code: number;
  cloud_cover: number;
  surface_pressure: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  visibility: number;
  uv_index: number;
}

export interface WeatherData {
  feelsLike: number;
  cloudCover: number;
  humidity: number;
  precipitation: number;
  rain: number;
  snowfall: number;
  temperature: number;
  uvIndex: number;
  visibility: number;
  wind: {
    degrees: number;
    speed: number;
  };
  code: number;
  pressure: number;
}

export async function getWeather(
  latitude: number,
  longitude: number
): Promise<WeatherData> {
  const data = await $fetch<WeatherResponse>(
    "https://api.open-meteo.com/v1/forecast",
    {
      query: {
        latitude,
        longitude,
        current: [
          "temperature_2m",
          "relative_humidity_2m",
          "apparent_temperature",
          "is_day",
          "precipitation",
          "rain",
          "showers",
          "snowfall",
          "weather_code",
          "cloud_cover",
          "surface_pressure",
          "wind_speed_10m",
          "wind_direction_10m",
          "visibility",
          "uv_index",
        ],
      },
    }
  );
  const w = data.current;

  return {
    cloudCover: w.cloud_cover,
    code: w.weather_code,
    feelsLike: w.apparent_temperature,
    humidity: w.relative_humidity_2m,
    precipitation: w.precipitation,
    pressure: w.surface_pressure,
    rain: w.rain,
    snowfall: w.snowfall,
    temperature: w.temperature_2m,
    uvIndex: w.uv_index,
    visibility: w.visibility,
    wind: {
      degrees: w.wind_direction_10m,
      speed: w.wind_speed_10m,
    },
  };
}
