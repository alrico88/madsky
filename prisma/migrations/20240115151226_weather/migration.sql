-- CreateTable
CREATE TABLE "MeasurementWeather" (
    "id" SERIAL NOT NULL,
    "skyMeasurementId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "feelsLike" INTEGER NOT NULL,
    "cloudCover" DOUBLE PRECISION NOT NULL,
    "humidity" DOUBLE PRECISION NOT NULL,
    "precipitation" DOUBLE PRECISION NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "uvIndex" DOUBLE PRECISION NOT NULL,
    "visibility" DOUBLE PRECISION NOT NULL,
    "windDegrees" DOUBLE PRECISION NOT NULL,
    "windSpeed" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "MeasurementWeather_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MeasurementWeather_skyMeasurementId_key" ON "MeasurementWeather"("skyMeasurementId");

-- AddForeignKey
ALTER TABLE "MeasurementWeather" ADD CONSTRAINT "MeasurementWeather_skyMeasurementId_fkey" FOREIGN KEY ("skyMeasurementId") REFERENCES "SkyMeasurement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
