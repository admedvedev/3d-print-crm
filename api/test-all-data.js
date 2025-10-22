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
    // Получаем данные из всех таблиц
    const [users, printers, filaments, clients, orders, settings] = await Promise.all([
      sql`SELECT * FROM users ORDER BY created_at DESC`,
      sql`SELECT * FROM printers ORDER BY created_at DESC`,
      sql`SELECT * FROM filaments ORDER BY created_at DESC`,
      sql`SELECT * FROM clients ORDER BY created_at DESC`,
      sql`SELECT * FROM orders ORDER BY created_at DESC`,
      sql`SELECT * FROM settings ORDER BY created_at DESC`
    ]);
    
    res.status(200).json({
      success: true,
      message: 'All data retrieved successfully',
      data: {
        users: {
          count: users.rows.length,
          data: users.rows
        },
        printers: {
          count: printers.rows.length,
          data: printers.rows
        },
        filaments: {
          count: filaments.rows.length,
          data: filaments.rows
        },
        clients: {
          count: clients.rows.length,
          data: clients.rows
        },
        orders: {
          count: orders.rows.length,
          data: orders.rows
        },
        settings: {
          count: settings.rows.length,
          data: settings.rows
        }
      }
    });
  } catch (error) {
    console.error('All data test error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve data',
      details: error.message
    });
  }
}
