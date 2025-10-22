import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  const { method } = req;
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { id } = req.query;
    
    switch (method) {
      case 'GET':
        if (id) {
          // Get single settings
          const result = await sql`SELECT * FROM settings WHERE id = ${id}`;
          if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Settings not found' });
          }
          res.status(200).json(result.rows[0]);
        } else {
          // Get all settings
          const result = await sql`SELECT * FROM settings ORDER BY created_at DESC`;
          res.status(200).json(result.rows);
        }
        break;
      case 'POST':
        // Create new settings
        const { user_id, electricity_rate, currency, default_markup } = req.body;
        if (!user_id || !electricity_rate || !currency || !default_markup) {
          return res.status(400).json({ error: 'All fields are required' });
        }
        
        const newSettings = {
          id: crypto.randomUUID(),
          user_id,
          electricity_rate: parseFloat(electricity_rate),
          currency,
          default_markup: parseFloat(default_markup),
          created_at: new Date().toISOString()
        };
        
        await sql`
          INSERT INTO settings (id, user_id, electricity_rate, currency, default_markup, created_at)
          VALUES (${newSettings.id}, ${newSettings.user_id}, ${newSettings.electricity_rate}, ${newSettings.currency}, ${newSettings.default_markup}, ${newSettings.created_at})
        `;
        
        res.status(201).json(newSettings);
        break;
      case 'PUT':
        if (!id) {
          return res.status(400).json({ error: 'Settings ID is required' });
        }
        // Update settings
        const { user_id: updateUserId, electricity_rate: updateElectricityRate, currency: updateCurrency, default_markup: updateDefaultMarkup } = req.body;
        
        const updateResult = await sql`
          UPDATE settings 
          SET user_id = ${updateUserId}, electricity_rate = ${updateElectricityRate}, currency = ${updateCurrency}, default_markup = ${updateDefaultMarkup}
          WHERE id = ${id}
          RETURNING *
        `;
        
        if (updateResult.rows.length === 0) {
          return res.status(404).json({ error: 'Settings not found' });
        }
        
        res.status(200).json(updateResult.rows[0]);
        break;
      case 'DELETE':
        if (!id) {
          return res.status(400).json({ error: 'Settings ID is required' });
        }
        // Delete settings
        const deleteResult = await sql`DELETE FROM settings WHERE id = ${id} RETURNING *`;
        
        if (deleteResult.rows.length === 0) {
          return res.status(404).json({ error: 'Settings not found' });
        }
        
        res.status(200).json({ success: true });
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
