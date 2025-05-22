-- CreateTable
CREATE TABLE "Ranking" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "time" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scenario" TEXT,
    "dateEnd" TIMESTAMP(3),

    CONSTRAINT "Ranking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Characters" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "xrange" INTEGER[],
    "yrange" INTEGER[],

    CONSTRAINT "Characters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Characters_name_key" ON "Characters"("name");
