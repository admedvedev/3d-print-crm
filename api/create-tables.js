// Create database tables through Vercel API
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Creating database tables...');

    // Create tables using raw SQL
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "email" TEXT NOT NULL UNIQUE,
        "password" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL
      );
    `;

    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Printer" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "user_id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "power" DOUBLE PRECISION NOT NULL,
        "cost" DOUBLE PRECISION NOT NULL,
        "depreciation" DOUBLE PRECISION NOT NULL,
        "total_hours" DOUBLE PRECISION NOT NULL,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL
      );
    `;

    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Filament" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "user_id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "weight" DOUBLE PRECISION NOT NULL,
        "cost" DOUBLE PRECISION NOT NULL,
        "color" TEXT NOT NULL,
        "in_stock" BOOLEAN NOT NULL DEFAULT true,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL
      );
    `;

    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Client" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "user_id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "phone" TEXT NOT NULL,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL
      );
    `;

    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Order" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "user_id" TEXT NOT NULL,
        "task_name" TEXT NOT NULL,
        "client_id" TEXT NOT NULL,
        "client_name" TEXT NOT NULL,
        "printer_id" TEXT NOT NULL,
        "printer_name" TEXT NOT NULL,
        "filament_id" TEXT NOT NULL,
        "filament_name" TEXT NOT NULL,
        "print_time_hours" INTEGER NOT NULL,
        "print_time_minutes" INTEGER NOT NULL,
        "weight" DOUBLE PRECISION NOT NULL,
        "markup" DOUBLE PRECISION NOT NULL,
        "status" TEXT NOT NULL,
        "cost" DOUBLE PRECISION NOT NULL,
        "date" TIMESTAMP(3) NOT NULL,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL
      );
    `;

    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Settings" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "user_id" TEXT NOT NULL,
        "electricity_rate" DOUBLE PRECISION NOT NULL,
        "currency" TEXT NOT NULL,
        "default_markup" DOUBLE PRECISION NOT NULL,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL
      );
    `;

    // Create initial user
    await prisma.user.upsert({
      where: { email: 'andybear@3dcrm.com' },
      update: {},
      create: {
        id: '1',
        email: 'andybear@3dcrm.com',
        password: 'pass111word',
        name: 'Администратор',
      }
    });

    // Create default settings
    await prisma.settings.upsert({
      where: { userId: '1' },
      update: {},
      create: {
        userId: '1',
        electricityRate: 5.5,
        currency: '₽',
        defaultMarkup: 20,
      }
    });

    res.status(200).json({ 
      message: 'Database tables created successfully',
      tables: ['User', 'Printer', 'Filament', 'Client', 'Order', 'Settings'],
      initialized: true
    });

  } catch (error) {
    console.error('Error creating tables:', error);
    res.status(500).json({ 
      error: 'Failed to create tables',
      details: error.message
    });
  } finally {
    await prisma.$disconnect();
  }
}
