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
    // Простой тест получения пользователей
    const result = await sql`SELECT * FROM users ORDER BY created_at DESC`;
    
    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      count: result.rows.length,
      users: result.rows
    });
  } catch (error) {
    console.error('Users test error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve users',
      details: error.message
    });
  }
}
