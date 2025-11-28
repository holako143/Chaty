-- CreateTable
CREATE TABLE "Flair" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "CustomEmoji" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Shortcut" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shortcutText" TEXT NOT NULL,
    "fullText" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "flairId" TEXT,
    CONSTRAINT "User_flairId_fkey" FOREIGN KEY ("flairId") REFERENCES "Flair" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("createdAt", "id", "password", "role", "username") SELECT "createdAt", "id", "password", "role", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Flair_name_key" ON "Flair"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CustomEmoji_name_key" ON "CustomEmoji"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Shortcut_shortcutText_key" ON "Shortcut"("shortcutText");
