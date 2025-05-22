-- CreateTable
CREATE TABLE "Ranking" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "time" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scenario" TEXT,

    CONSTRAINT "Ranking_pkey" PRIMARY KEY ("id")
);
