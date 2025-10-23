// Health check endpoint
import { PrismaClient } from '@prisma/client'

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Check if Prisma can connect
    let prismaStatus = 'disconnected';
    let databaseUrl = 'not set';
    
    try {
      const prisma = new PrismaClient();
      await prisma.$connect();
      prismaStatus = 'connected';
      databaseUrl = process.env.POSTGRES_PRISMA_URL ? 'set' : 'not set';
      await prisma.$disconnect();
    } catch (error) {
      prismaStatus = 'error';
      console.error('Prisma connection error:', error.message);
    }

    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      prisma: {
        status: prismaStatus,
        databaseUrl: databaseUrl
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        vercel: process.env.VERCEL ? 'true' : 'false'
      }
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
