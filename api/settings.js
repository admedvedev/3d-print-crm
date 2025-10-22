// API route for settings
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
        // Get all settings
        const settings = await getSettings();
        res.status(200).json(settings);
        break;
      case 'POST':
        // Create new settings
        const newSettings = await createSettings(req.body);
        res.status(201).json(newSettings);
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
async function getSettings() {
  return [
    {
      id: "1",
      userId: "1",
      electricityRate: 5.5,
      currency: "₽",
      defaultMarkup: 20
    }
  ];
}

async function createSettings(settingsData) {
  const newSettings = {
    id: crypto.randomUUID(),
    ...settingsData,
    createdAt: new Date().toISOString()
  };
  return newSettings;
}
