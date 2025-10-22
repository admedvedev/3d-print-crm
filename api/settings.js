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
    const { id } = req.query;
    
    switch (method) {
      case 'GET':
        if (id) {
          // Get single settings
          const settings = await getSettingsById(id);
          if (!settings) {
            return res.status(404).json({ error: 'Settings not found' });
          }
          res.status(200).json(settings);
        } else {
          // Get all settings
          const settings = await getSettings();
          res.status(200).json(settings);
        }
        break;
      case 'POST':
        // Create new settings
        const newSettings = await createSettings(req.body);
        res.status(201).json(newSettings);
        break;
      case 'PUT':
        if (!id) {
          return res.status(400).json({ error: 'Settings ID is required' });
        }
        // Update settings
        const updatedSettings = await updateSettings(id, req.body);
        if (!updatedSettings) {
          return res.status(404).json({ error: 'Settings not found' });
        }
        res.status(200).json(updatedSettings);
        break;
      case 'DELETE':
        if (!id) {
          return res.status(400).json({ error: 'Settings ID is required' });
        }
        // Delete settings
        const deleted = await deleteSettings(id);
        if (!deleted) {
          return res.status(404).json({ error: 'Settings not found' });
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
let settings = [
  {
    id: "1",
    userId: "1",
    electricityRate: 5.5,
    currency: "₽",
    defaultMarkup: 20
  }
];

async function getSettings() {
  return settings;
}

async function getSettingsById(id) {
  return settings.find(setting => setting.id === id);
}

async function createSettings(settingsData) {
  const newSettings = {
    id: crypto.randomUUID(),
    ...settingsData,
    createdAt: new Date().toISOString()
  };
  settings.push(newSettings);
  return newSettings;
}

async function updateSettings(id, settingsData) {
  const index = settings.findIndex(setting => setting.id === id);
  if (index === -1) {
    return null;
  }
  settings[index] = { ...settings[index], ...settingsData };
  return settings[index];
}

async function deleteSettings(id) {
  const index = settings.findIndex(setting => setting.id === id);
  if (index === -1) {
    return false;
  }
  settings.splice(index, 1);
  return true;
}
