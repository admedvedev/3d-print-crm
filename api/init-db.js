// Initialize database with initial data
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Create initial user
    const user = await prisma.user.upsert({
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
    const settings = await prisma.settings.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        electricityRate: 5.5,
        currency: '₽',
        defaultMarkup: 20,
      }
    });

    res.status(200).json({ 
      message: 'Database initialized successfully',
      user,
      settings
    });
  } catch (error) {
    console.error('Database initialization error:', error);
    res.status(500).json({ 
      error: 'Failed to initialize database',
      details: error.message
    });
  } finally {
    await prisma.$disconnect();
  }
}