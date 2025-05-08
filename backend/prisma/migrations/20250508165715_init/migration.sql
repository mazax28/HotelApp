-- CreateTable
CREATE TABLE "Hotel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Room" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "number" TEXT NOT NULL,
    "hotelId" INTEGER NOT NULL,
    "positionX" INTEGER NOT NULL,
    "positionY" INTEGER NOT NULL,
    "floor" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    CONSTRAINT "Room_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Client" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "document" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hotelId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,
    "clientId" INTEGER NOT NULL,
    "checkInDate" DATETIME NOT NULL,
    "checkOutDate" DATETIME NOT NULL,
    "guestCount" INTEGER NOT NULL,
    CONSTRAINT "Reservation_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Reservation_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Reservation_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Hotel_name_key" ON "Hotel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Client_document_key" ON "Client"("document");
