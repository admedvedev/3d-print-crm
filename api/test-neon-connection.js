import { sql } from '@vercel/postgres';

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
    // Тест подключения к Neon
    const result = await sql.query('SELECT NOW() as current_time, version() as postgres_version');
    
    res.status(200).json({
      success: true,
      message: 'Neon connection successful',
      data: result.rows[0],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Neon connection error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Neon connection failed',
      details: error.message,
      code: error.code,
      timestamp: new Date().toISOString()
    });
  }
}
