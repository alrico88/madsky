-- CreateTable
CREATE TABLE "SkyMeasurement" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "average_color" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "SkyMeasurement_pkey" PRIMARY KEY ("id")
);
