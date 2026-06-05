-- Run this SQL in your Supabase SQL Editor to create the database tables

-- Drop existing types if they exist
DROP TYPE IF EXISTS "Role" CASCADE;
DROP TYPE IF EXISTS "OrderStatus" CASCADE;
DROP TYPE IF EXISTS "VehicleStatus" CASCADE;
DROP TYPE IF EXISTS "Priority" CASCADE;

-- Create Enums
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MANAGER', 'CLIENT', 'DRIVER');
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE "VehicleStatus" AS ENUM ('AVAILABLE', 'IN_TRANSIT', 'MAINTENANCE', 'IDLE');
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- Drop existing tables if they exist
DROP TABLE IF EXISTS "TrackingEvent" CASCADE;
DROP TABLE IF EXISTS "Order" CASCADE;
DROP TABLE IF EXISTS "Vehicle" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

-- Create Users Table
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "avatar" TEXT,
    "role" "Role" DEFAULT NULL,
    "authProvider" TEXT DEFAULT 'local',
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Create Vehicles Table
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "plateNumber" TEXT NOT NULL,
    "driverName" TEXT,
    "driverId" TEXT,
    "status" "VehicleStatus" NOT NULL DEFAULT 'AVAILABLE',
    "speed" TEXT,
    "fuelLevel" INTEGER,
    "load" TEXT,
    "deliveries" INTEGER,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "lastUpdated" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- Create Orders Table
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "workName" TEXT NOT NULL,
    "description" TEXT,
    "clientId" TEXT NOT NULL,
    "assignedVehicleId" TEXT,
    "assignedDriverId" TEXT,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "trackingEnabled" BOOLEAN NOT NULL DEFAULT false,
    "location" TEXT,
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- Create TrackingEvents Table
CREATE TABLE "TrackingEvent" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "orderId" TEXT,
    "driverId" TEXT,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "speed" TEXT,
    "fuelLevel" INTEGER,
    "status" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrackingEvent_pkey" PRIMARY KEY ("id")
);

-- Create Unique Constraints
ALTER TABLE "User" ADD CONSTRAINT "User_email_key" UNIQUE ("email");
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_plateNumber_key" UNIQUE ("plateNumber");

-- Create Foreign Key Constraints
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Order" ADD CONSTRAINT "Order_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Order" ADD CONSTRAINT "Order_assignedVehicleId_fkey" FOREIGN KEY ("assignedVehicleId") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "TrackingEvent" ADD CONSTRAINT "TrackingEvent_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "TrackingEvent" ADD CONSTRAINT "TrackingEvent_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "TrackingEvent" ADD CONSTRAINT "TrackingEvent_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Create Indexes
CREATE INDEX "TrackingEvent_vehicleId_idx" ON "TrackingEvent"("vehicleId");
CREATE INDEX "TrackingEvent_orderId_idx" ON "TrackingEvent"("orderId");
CREATE INDEX "TrackingEvent_driverId_idx" ON "TrackingEvent"("driverId");

-- Create Default Admin User (Password: Admin@1234)
INSERT INTO "User" ("id", "name", "email", "password", "role", "authProvider", "createdAt", "updatedAt")
VALUES (
    gen_random_uuid(),
    'Admin User',
    'mouleshmr11@gmail.com',
    '$2a$10$rZqZ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z',
    'ADMIN',
    'local',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);
