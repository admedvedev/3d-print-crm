// API route for printers
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
        // Get all printers
        const printers = await getPrinters();
        res.status(200).json(printers);
        break;
      case 'POST':
        // Create new printer
        const newPrinter = await createPrinter(req.body);
        res.status(201).json(newPrinter);
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
async function getPrinters() {
  return [
    {
      id: "1",
      userId: "1",
      name: "Prusa i3 MK3S",
      power: 220,
      cost: 25000,
      depreciation: 10,
      totalHours: 150
    }
  ];
}

async function createPrinter(printerData) {
  const newPrinter = {
    id: crypto.randomUUID(),
    ...printerData,
    createdAt: new Date().toISOString()
  };
  return newPrinter;
}
