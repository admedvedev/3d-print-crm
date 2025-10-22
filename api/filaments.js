// API route for filaments
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
    switch (method) {
      case 'GET':
        // Get all filaments
        const filaments = await getFilaments();
        res.status(200).json(filaments);
        break;
      case 'POST':
        // Create new filament
        const newFilament = await createFilament(req.body);
        res.status(201).json(newFilament);
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Mock database functions
async function getFilaments() {
  return [
    {
      id: "1",
      userId: "1",
      name: "PLA Базовый",
      weight: 1,
      cost: 800,
      color: "#FF6B6B",
      inStock: true
    }
  ];
}

async function createFilament(filamentData) {
  const newFilament = {
    id: crypto.randomUUID(),
    ...filamentData,
    createdAt: new Date().toISOString()
  };
  return newFilament;
}
