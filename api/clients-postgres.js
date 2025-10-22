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
          // Get single client
          const result = await sql`SELECT * FROM clients WHERE id = ${id}`;
          if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Client not found' });
          }
          res.status(200).json(result.rows[0]);
        } else {
          // Get all clients
          const result = await sql`SELECT * FROM clients ORDER BY created_at DESC`;
          res.status(200).json(result.rows);
        }
        break;
      case 'POST':
        // Create new client
        const { user_id, name, email, phone } = req.body;
        if (!user_id || !name || !email || !phone) {
          return res.status(400).json({ error: 'All fields are required' });
        }
        
        const newClient = {
          id: crypto.randomUUID(),
          user_id,
          name,
          email,
          phone,
          created_at: new Date().toISOString()
        };
        
        await sql`
          INSERT INTO clients (id, user_id, name, email, phone, created_at)
          VALUES (${newClient.id}, ${newClient.user_id}, ${newClient.name}, ${newClient.email}, ${newClient.phone}, ${newClient.created_at})
        `;
        
        res.status(201).json(newClient);
        break;
      case 'PUT':
        if (!id) {
          return res.status(400).json({ error: 'Client ID is required' });
        }
        // Update client
        const { user_id: updateUserId, name: updateName, email: updateEmail, phone: updatePhone } = req.body;
        
        const updateResult = await sql`
          UPDATE clients 
          SET user_id = ${updateUserId}, name = ${updateName}, email = ${updateEmail}, phone = ${updatePhone}
          WHERE id = ${id}
          RETURNING *
        `;
        
        if (updateResult.rows.length === 0) {
          return res.status(404).json({ error: 'Client not found' });
        }
        
        res.status(200).json(updateResult.rows[0]);
        break;
      case 'DELETE':
        if (!id) {
          return res.status(400).json({ error: 'Client ID is required' });
        }
        // Delete client
        const deleteResult = await sql`DELETE FROM clients WHERE id = ${id} RETURNING *`;
        
        if (deleteResult.rows.length === 0) {
          return res.status(404).json({ error: 'Client not found' });
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
