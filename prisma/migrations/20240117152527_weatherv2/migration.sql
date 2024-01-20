/*
  Warnings:

  - Added the required column `pressure` to the `MeasurementWeather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rain` to the `MeasurementWeather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `snowfall` to the `MeasurementWeather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weatherCode` to the `MeasurementWeather` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MeasurementWeather" ADD COLUMN     "pressure" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "rain" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "snowfall" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "weatherCode" INTEGER NOT NULL,
ALTER COLUMN "feelsLike" SET DATA TYPE DOUBLE PRECISION;
