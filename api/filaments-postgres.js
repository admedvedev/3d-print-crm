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
          // Get single filament
          const result = await sql`SELECT * FROM filaments WHERE id = ${id}`;
          if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Filament not found' });
          }
          res.status(200).json(result.rows[0]);
        } else {
          // Get all filaments
          const result = await sql`SELECT * FROM filaments ORDER BY created_at DESC`;
          res.status(200).json(result.rows);
        }
        break;
      case 'POST':
        // Create new filament
        const { user_id, name, weight, cost, color, in_stock } = req.body;
        if (!user_id || !name || !weight || !cost || !color) {
          return res.status(400).json({ error: 'All required fields must be provided' });
        }
        
        const newFilament = {
          id: crypto.randomUUID(),
          user_id,
          name,
          weight: parseFloat(weight),
          cost: parseFloat(cost),
          color,
          in_stock: in_stock !== undefined ? in_stock : true,
          created_at: new Date().toISOString()
        };
        
        await sql`
          INSERT INTO filaments (id, user_id, name, weight, cost, color, in_stock, created_at)
          VALUES (${newFilament.id}, ${newFilament.user_id}, ${newFilament.name}, ${newFilament.weight}, ${newFilament.cost}, ${newFilament.color}, ${newFilament.in_stock}, ${newFilament.created_at})
        `;
        
        res.status(201).json(newFilament);
        break;
      case 'PUT':
        if (!id) {
          return res.status(400).json({ error: 'Filament ID is required' });
        }
        // Update filament
        const { user_id: updateUserId, name: updateName, weight: updateWeight, cost: updateCost, color: updateColor, in_stock: updateInStock } = req.body;
        
        const updateResult = await sql`
          UPDATE filaments 
          SET user_id = ${updateUserId}, name = ${updateName}, weight = ${updateWeight}, cost = ${updateCost}, color = ${updateColor}, in_stock = ${updateInStock}
          WHERE id = ${id}
          RETURNING *
        `;
        
        if (updateResult.rows.length === 0) {
          return res.status(404).json({ error: 'Filament not found' });
        }
        
        res.status(200).json(updateResult.rows[0]);
        break;
      case 'DELETE':
        if (!id) {
          return res.status(400).json({ error: 'Filament ID is required' });
        }
        // Delete filament
        const deleteResult = await sql`DELETE FROM filaments WHERE id = ${id} RETURNING *`;
        
        if (deleteResult.rows.length === 0) {
          return res.status(404).json({ error: 'Filament not found' });
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
