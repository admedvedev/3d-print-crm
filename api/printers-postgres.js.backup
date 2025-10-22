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
          // Get single printer
          const result = await sql`SELECT * FROM printers WHERE id = ${id}`;
          if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Printer not found' });
          }
          res.status(200).json(result.rows[0]);
        } else {
          // Get all printers
          const result = await sql`SELECT * FROM printers ORDER BY created_at DESC`;
          res.status(200).json(result.rows);
        }
        break;
      case 'POST':
        // Create new printer
        const { user_id, name, power, cost, depreciation, total_hours } = req.body;
        if (!user_id || !name || !power || !cost || !depreciation || !total_hours) {
          return res.status(400).json({ error: 'All fields are required' });
        }
        
        const newPrinter = {
          id: crypto.randomUUID(),
          user_id,
          name,
          power: parseInt(power),
          cost: parseFloat(cost),
          depreciation: parseFloat(depreciation),
          total_hours: parseInt(total_hours),
          created_at: new Date().toISOString()
        };
        
        await sql`
          INSERT INTO printers (id, user_id, name, power, cost, depreciation, total_hours, created_at)
          VALUES (${newPrinter.id}, ${newPrinter.user_id}, ${newPrinter.name}, ${newPrinter.power}, ${newPrinter.cost}, ${newPrinter.depreciation}, ${newPrinter.total_hours}, ${newPrinter.created_at})
        `;
        
        res.status(201).json(newPrinter);
        break;
      case 'PUT':
        if (!id) {
          return res.status(400).json({ error: 'Printer ID is required' });
        }
        // Update printer
        const { user_id: updateUserId, name: updateName, power: updatePower, cost: updateCost, depreciation: updateDepreciation, total_hours: updateTotalHours } = req.body;
        
        const updateResult = await sql`
          UPDATE printers 
          SET user_id = ${updateUserId}, name = ${updateName}, power = ${updatePower}, cost = ${updateCost}, depreciation = ${updateDepreciation}, total_hours = ${updateTotalHours}
          WHERE id = ${id}
          RETURNING *
        `;
        
        if (updateResult.rows.length === 0) {
          return res.status(404).json({ error: 'Printer not found' });
        }
        
        res.status(200).json(updateResult.rows[0]);
        break;
      case 'DELETE':
        if (!id) {
          return res.status(400).json({ error: 'Printer ID is required' });
        }
        // Delete printer
        const deleteResult = await sql`DELETE FROM printers WHERE id = ${id} RETURNING *`;
        
        if (deleteResult.rows.length === 0) {
          return res.status(404).json({ error: 'Printer not found' });
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
