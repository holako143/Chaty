-- CreateTable
CREATE TABLE "FilteredWord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "word" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Ban" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fingerprint" TEXT,
    "ipAddress" TEXT,
    "reason" TEXT,
    "expiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "FilteredWord_word_key" ON "FilteredWord"("word");

-- CreateIndex
CREATE INDEX "Ban_fingerprint_idx" ON "Ban"("fingerprint");

-- CreateIndex
CREATE INDEX "Ban_ipAddress_idx" ON "Ban"("ipAddress");
