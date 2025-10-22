// Simple in-memory database for Vercel
let db = {
  users: [
    {
      id: "1",
      email: "admin@example.com",
      password: "admin123",
      name: "Администратор",
      createdAt: "2024-01-01T00:00:00.000Z"
    }
  ],
  printers: [
    {
      id: "1",
      userId: "1",
      name: "Prusa i3 MK3S",
      power: 220,
      cost: 25000,
      depreciation: 10,
      totalHours: 150
    }
  ],
  filaments: [
    {
      id: "1",
      userId: "1",
      name: "PLA Базовый",
      weight: 1,
      cost: 800,
      color: "#FF6B6B",
      inStock: true
    }
  ],
  clients: [
    {
      id: "1",
      userId: "1",
      name: "Иванов И.И.",
      email: "ivanov@example.com",
      phone: "+7 (999) 123-45-67"
    }
  ],
  orders: [
    {
      id: "1",
      userId: "1",
      taskName: "Тестовое задание",
      clientId: "1",
      clientName: "Иванов И.И.",
      printerId: "1",
      printerName: "Prusa i3 MK3S",
      filamentId: "1",
      filamentName: "PLA Базовый",
      printTimeHours: 2,
      printTimeMinutes: 30,
      weight: 50,
      markup: 20,
      status: "completed",
      cost: 1250.5,
      date: "2024-01-15"
    }
  ],
  settings: [
    {
      id: "1",
      userId: "1",
      electricityRate: 5.5,
      currency: "₽",
      defaultMarkup: 20
    }
  ]
};

module.exports = async (req, res) => {
  const { method, query } = req;
  const { table, id } = query;
  
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
    if (!table || !db[table]) {
      return res.status(404).json({ error: 'Table not found' });
    }

    switch (method) {
      case 'GET':
        if (id) {
          // Get single item
          const item = db[table].find(item => item.id === id);
          if (!item) {
            return res.status(404).json({ error: 'Item not found' });
          }
          res.status(200).json(item);
        } else {
          // Get all items
          res.status(200).json(db[table]);
        }
        break;
        
      case 'POST':
        // Create new item
        const newItem = {
          id: require('crypto').randomUUID(),
          ...req.body,
          createdAt: new Date().toISOString()
        };
        db[table].push(newItem);
        res.status(201).json(newItem);
        break;
        
      case 'PUT':
        // Update item
        const updateIndex = db[table].findIndex(item => item.id === id);
        if (updateIndex === -1) {
          return res.status(404).json({ error: 'Item not found' });
        }
        db[table][updateIndex] = { ...db[table][updateIndex], ...req.body };
        res.status(200).json(db[table][updateIndex]);
        break;
        
      case 'DELETE':
        // Delete item
        const deleteIndex = db[table].findIndex(item => item.id === id);
        if (deleteIndex === -1) {
          return res.status(404).json({ error: 'Item not found' });
        }
        db[table].splice(deleteIndex, 1);
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
};