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
          // Get single user
          const result = await sql`SELECT * FROM users WHERE id = ${id}`;
          if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
          }
          res.status(200).json(result.rows[0]);
        } else {
          // Get all users
          const result = await sql`SELECT * FROM users ORDER BY created_at DESC`;
          res.status(200).json(result.rows);
        }
        break;
      case 'POST':
        // Create new user
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
          return res.status(400).json({ error: 'Email, password, and name are required' });
        }
        
        const newUser = {
          id: crypto.randomUUID(),
          email,
          password,
          name,
          created_at: new Date().toISOString()
        };
        
        await sql`
          INSERT INTO users (id, email, password, name, created_at)
          VALUES (${newUser.id}, ${newUser.email}, ${newUser.password}, ${newUser.name}, ${newUser.created_at})
        `;
        
        res.status(201).json(newUser);
        break;
      case 'PUT':
        if (!id) {
          return res.status(400).json({ error: 'User ID is required' });
        }
        // Update user
        const { email: updateEmail, password: updatePassword, name: updateName } = req.body;
        
        const updateResult = await sql`
          UPDATE users 
          SET email = ${updateEmail}, password = ${updatePassword}, name = ${updateName}
          WHERE id = ${id}
          RETURNING *
        `;
        
        if (updateResult.rows.length === 0) {
          return res.status(404).json({ error: 'User not found' });
        }
        
        res.status(200).json(updateResult.rows[0]);
        break;
      case 'DELETE':
        if (!id) {
          return res.status(400).json({ error: 'User ID is required' });
        }
        // Delete user
        const deleteResult = await sql`DELETE FROM users WHERE id = ${id} RETURNING *`;
        
        if (deleteResult.rows.length === 0) {
          return res.status(404).json({ error: 'User not found' });
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
