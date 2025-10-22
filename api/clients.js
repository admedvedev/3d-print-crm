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
    const { id } = req.query;
    
    switch (method) {
      case 'GET':
        if (id) {
          // Get single client
          const client = await getClientById(id);
          if (!client) {
            return res.status(404).json({ error: 'Client not found' });
          }
          res.status(200).json(client);
        } else {
          // Get all clients
          const clients = await getClients();
          res.status(200).json(clients);
        }
        break;
      case 'POST':
        // Create new client
        const newClient = await createClient(req.body);
        res.status(201).json(newClient);
        break;
      case 'PUT':
        if (!id) {
          return res.status(400).json({ error: 'Client ID is required' });
        }
        // Update client
        const updatedClient = await updateClient(id, req.body);
        if (!updatedClient) {
          return res.status(404).json({ error: 'Client not found' });
        }
        res.status(200).json(updatedClient);
        break;
      case 'DELETE':
        if (!id) {
          return res.status(400).json({ error: 'Client ID is required' });
        }
        // Delete client
        const deleted = await deleteClient(id);
        if (!deleted) {
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

// Mock database functions
let clients = [
  {
    id: "1",
    userId: "1",
    name: "Иванов И.И.",
    email: "ivanov@example.com",
    phone: "+7 (999) 123-45-67"
  }
];

async function getClients() {
  return clients;
}

async function getClientById(id) {
  return clients.find(client => client.id === id);
}

async function createClient(clientData) {
  const newClient = {
    id: crypto.randomUUID(),
    ...clientData,
    createdAt: new Date().toISOString()
  };
  clients.push(newClient);
  return newClient;
}

async function updateClient(id, clientData) {
  const index = clients.findIndex(client => client.id === id);
  if (index === -1) {
    return null;
  }
  clients[index] = { ...clients[index], ...clientData };
  return clients[index];
}

async function deleteClient(id) {
  const index = clients.findIndex(client => client.id === id);
  if (index === -1) {
    return false;
  }
  clients.splice(index, 1);
  return true;
}
