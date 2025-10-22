// API route for users
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
        // Get all users
        const users = await getUsers();
        res.status(200).json(users);
        break;
      case 'POST':
        // Create new user
        const newUser = await createUser(req.body);
        res.status(201).json(newUser);
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

// Mock database functions (replace with real database)
async function getUsers() {
  // This would connect to your database
  return [
    {
      id: "1",
      email: "admin@example.com",
      name: "Администратор",
      createdAt: "2024-01-01T00:00:00.000Z"
    }
  ];
}

async function createUser(userData) {
  // This would save to your database
  const newUser = {
    id: crypto.randomUUID(),
    ...userData,
    createdAt: new Date().toISOString()
  };
  return newUser;
}
