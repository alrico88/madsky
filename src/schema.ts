import { relations } from "drizzle-orm";
import {
  pgTable,
  timestamp,
  text,
  integer,
  serial,
  doublePrecision,
} from "drizzle-orm/pg-core";

export const skyMeasurement = pgTable("SkyMeasurement", {
  id: serial("id").primaryKey().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  averageColor: text("average_color").notNull(),
  image: text("image").notNull(),
});

export const skyMeasurementRelations = relations(skyMeasurement, ({ one }) => {
  return {
    weather: one(measurementWeather),
  };
});

export const measurementWeather = pgTable("MeasurementWeather", {
  id: serial("id").primaryKey().notNull(),
  skyMeasurementId: integer("skyMeasurementId")
    .notNull()
    .references(() => skyMeasurement.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  feelsLike: doublePrecision("feelsLike").notNull(),
  cloudCover: doublePrecision("cloudCover").notNull(),
  humidity: doublePrecision("humidity").notNull(),
  precipitation: doublePrecision("precipitation").notNull(),
  temperature: doublePrecision("temperature").notNull(),
  uvIndex: doublePrecision("uvIndex").notNull(),
  visibility: doublePrecision("visibility").notNull(),
  windDegrees: doublePrecision("windDegrees").notNull(),
  windSpeed: doublePrecision("windSpeed").notNull(),
  pressure: doublePrecision("pressure").notNull(),
  rain: doublePrecision("rain").notNull(),
  snowfall: doublePrecision("snowfall").notNull(),
  weatherCode: integer("weatherCode").notNull(),
});

export const measurementWeatherRelations = relations(
  measurementWeather,
  ({ one }) => {
    return {
      measurement: one(skyMeasurement, {
        fields: [measurementWeather.id],
        references: [skyMeasurement.id],
      }),
    };
  }
);

export type skyMeasurementType = typeof skyMeasurement.$inferSelect;
