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
    const { id } = req.query;
    
    switch (method) {
      case 'GET':
        if (id) {
          // Get single printer
          const printer = await getPrinterById(id);
          if (!printer) {
            return res.status(404).json({ error: 'Printer not found' });
          }
          res.status(200).json(printer);
        } else {
          // Get all printers
          const printers = await getPrinters();
          res.status(200).json(printers);
        }
        break;
      case 'POST':
        // Create new printer
        const newPrinter = await createPrinter(req.body);
        res.status(201).json(newPrinter);
        break;
      case 'PUT':
        if (!id) {
          return res.status(400).json({ error: 'Printer ID is required' });
        }
        // Update printer
        const updatedPrinter = await updatePrinter(id, req.body);
        if (!updatedPrinter) {
          return res.status(404).json({ error: 'Printer not found' });
        }
        res.status(200).json(updatedPrinter);
        break;
      case 'DELETE':
        if (!id) {
          return res.status(400).json({ error: 'Printer ID is required' });
        }
        // Delete printer
        const deleted = await deletePrinter(id);
        if (!deleted) {
          return res.status(404).json({ error: 'Printer not found' });
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
let printers = [
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

async function getPrinters() {
  return printers;
}

async function getPrinterById(id) {
  return printers.find(printer => printer.id === id);
}

async function createPrinter(printerData) {
  const newPrinter = {
    id: crypto.randomUUID(),
    ...printerData,
    createdAt: new Date().toISOString()
  };
  printers.push(newPrinter);
  return newPrinter;
}

async function updatePrinter(id, printerData) {
  const index = printers.findIndex(printer => printer.id === id);
  if (index === -1) {
    return null;
  }
  printers[index] = { ...printers[index], ...printerData };
  return printers[index];
}

async function deletePrinter(id) {
  const index = printers.findIndex(printer => printer.id === id);
  if (index === -1) {
    return false;
  }
  printers.splice(index, 1);
  return true;
}
