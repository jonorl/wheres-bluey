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
