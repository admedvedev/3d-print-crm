import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Создаем пользователя по умолчанию
    const defaultUser = await prisma.user.upsert({
      where: { email: 'andybear@3dcrm.com' },
      update: {},
      create: {
        email: 'andybear@3dcrm.com',
        password: 'pass111word',
        name: 'Администратор'
      }
    });

    // Создаем настройки по умолчанию
    await prisma.settings.upsert({
      where: { userId: defaultUser.id },
      update: {},
      create: {
        userId: defaultUser.id,
        electricityRate: 5.5,
        currency: 'RUB',
        defaultMarkup: 20
      }
    });

    res.status(200).json({
      success: true,
      message: 'Prisma database initialized successfully',
      user: {
        id: defaultUser.id,
        email: defaultUser.email,
        name: defaultUser.name
      }
    });
  } catch (error) {
    console.error('Database initialization error:', error);
    res.status(500).json({ 
      error: 'Database initialization failed',
      details: error.message 
    });
  } finally {
    await prisma.$disconnect();
  }
}
