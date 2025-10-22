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
    const { id } = req.query;
    
    switch (method) {
      case 'GET':
        if (id) {
          // Get single filament
          const filament = await getFilamentById(id);
          if (!filament) {
            return res.status(404).json({ error: 'Filament not found' });
          }
          res.status(200).json(filament);
        } else {
          // Get all filaments
          const filaments = await getFilaments();
          res.status(200).json(filaments);
        }
        break;
      case 'POST':
        // Create new filament
        const newFilament = await createFilament(req.body);
        res.status(201).json(newFilament);
        break;
      case 'PUT':
        if (!id) {
          return res.status(400).json({ error: 'Filament ID is required' });
        }
        // Update filament
        const updatedFilament = await updateFilament(id, req.body);
        if (!updatedFilament) {
          return res.status(404).json({ error: 'Filament not found' });
        }
        res.status(200).json(updatedFilament);
        break;
      case 'DELETE':
        if (!id) {
          return res.status(400).json({ error: 'Filament ID is required' });
        }
        // Delete filament
        const deleted = await deleteFilament(id);
        if (!deleted) {
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

// Mock database functions
let filaments = [
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

async function getFilaments() {
  return filaments;
}

async function getFilamentById(id) {
  return filaments.find(filament => filament.id === id);
}

async function createFilament(filamentData) {
  const newFilament = {
    id: crypto.randomUUID(),
    ...filamentData,
    createdAt: new Date().toISOString()
  };
  filaments.push(newFilament);
  return newFilament;
}

async function updateFilament(id, filamentData) {
  const index = filaments.findIndex(filament => filament.id === id);
  if (index === -1) {
    return null;
  }
  filaments[index] = { ...filaments[index], ...filamentData };
  return filaments[index];
}

async function deleteFilament(id) {
  const index = filaments.findIndex(filament => filament.id === id);
  if (index === -1) {
    return false;
  }
  filaments.splice(index, 1);
  return true;
}
