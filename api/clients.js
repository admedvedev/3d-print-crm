// API route for clients
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
        // Get all clients
        const clients = await getClients();
        res.status(200).json(clients);
        break;
      case 'POST':
        // Create new client
        const newClient = await createClient(req.body);
        res.status(201).json(newClient);
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
async function getClients() {
  return [
    {
      id: "1",
      userId: "1",
      name: "Иванов И.И.",
      email: "ivanov@example.com",
      phone: "+7 (999) 123-45-67"
    }
  ];
}

async function createClient(clientData) {
  const newClient = {
    id: crypto.randomUUID(),
    ...clientData,
    createdAt: new Date().toISOString()
  };
  return newClient;
}
