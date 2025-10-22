// API route for orders
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
          // Get single order
          const order = await getOrderById(id);
          if (!order) {
            return res.status(404).json({ error: 'Order not found' });
          }
          res.status(200).json(order);
        } else {
          // Get all orders
          const orders = await getOrders();
          res.status(200).json(orders);
        }
        break;
      case 'POST':
        // Create new order
        const newOrder = await createOrder(req.body);
        res.status(201).json(newOrder);
        break;
      case 'PUT':
        if (!id) {
          return res.status(400).json({ error: 'Order ID is required' });
        }
        // Update order
        const updatedOrder = await updateOrder(id, req.body);
        if (!updatedOrder) {
          return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json(updatedOrder);
        break;
      case 'DELETE':
        if (!id) {
          return res.status(400).json({ error: 'Order ID is required' });
        }
        // Delete order
        const deleted = await deleteOrder(id);
        if (!deleted) {
          return res.status(404).json({ error: 'Order not found' });
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
let orders = [
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
];

async function getOrders() {
  return orders;
}

async function getOrderById(id) {
  return orders.find(order => order.id === id);
}

async function createOrder(orderData) {
  const newOrder = {
    id: crypto.randomUUID(),
    ...orderData,
    createdAt: new Date().toISOString()
  };
  orders.push(newOrder);
  return newOrder;
}

async function updateOrder(id, orderData) {
  const index = orders.findIndex(order => order.id === id);
  if (index === -1) {
    return null;
  }
  orders[index] = { ...orders[index], ...orderData };
  return orders[index];
}

async function deleteOrder(id) {
  const index = orders.findIndex(order => order.id === id);
  if (index === -1) {
    return false;
  }
  orders.splice(index, 1);
  return true;
}
