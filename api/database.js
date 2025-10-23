// Simple in-memory database for Vercel
let data = {
  users: [
    {
      id: '1',
      email: 'andybear@3dcrm.com',
      password: 'pass111word',
      name: 'Администратор',
      createdAt: new Date().toISOString()
    }
  ],
  printers: [],
  filaments: [],
  clients: [],
  orders: [],
  settings: []
};

export default async function handler(req, res) {
  const { method } = req;
  const { table, id } = req.query;
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Валидация таблицы
  const validTables = ['users', 'printers', 'filaments', 'clients', 'orders', 'settings'];
  if (!table || !validTables.includes(table)) {
    return res.status(400).json({ 
      error: 'Invalid table name', 
      validTables: validTables 
    });
  }

  try {
    switch (method) {
      case 'GET':
        if (id) {
          // Get single record
          const record = data[table].find(item => item.id === id);
          if (!record) {
            return res.status(404).json({ error: `${table} not found` });
          }
          res.status(200).json(record);
        } else {
          // Get all records
          res.status(200).json(data[table]);
        }
        break;
        
      case 'POST':
        // Create new record
        const newRecord = {
          id: generateId(),
          ...req.body,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        data[table].push(newRecord);
        res.status(201).json(newRecord);
        break;
        
      case 'PUT':
        if (!id) {
          return res.status(400).json({ error: 'ID is required for update' });
        }
        // Update record
        const index = data[table].findIndex(item => item.id === id);
        if (index === -1) {
          return res.status(404).json({ error: `${table} not found` });
        }
        data[table][index] = {
          ...data[table][index],
          ...req.body,
          updatedAt: new Date().toISOString()
        };
        res.status(200).json(data[table][index]);
        break;
        
      case 'DELETE':
        if (!id) {
          return res.status(400).json({ error: 'ID is required for deletion' });
        }
        // Delete record
        const deleteIndex = data[table].findIndex(item => item.id === id);
        if (deleteIndex === -1) {
          return res.status(404).json({ error: `${table} not found` });
        }
        data[table].splice(deleteIndex, 1);
        res.status(200).json({ success: true });
        break;
        
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      details: error.message,
      table: table,
      method: method
    });
  }
}

// Helper function to generate unique IDs
function generateId() {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}
