import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  const { method } = req;
  const { table, id } = req.query;
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Валидация таблицы
  const validTables = ['users', 'printers', 'filaments', 'clients', 'orders', 'settings'];
  if (!table || !validTables.includes(table)) {
    return res.status(400).json({ 
      error: 'Invalid table name', 
      validTables: validTables 
    });
  }

  try {
    switch (method) {
      case 'GET':
        if (id) {
          // Get single record
          const result = await getRecord(table, id);
          if (!result) {
            return res.status(404).json({ error: `${table} not found` });
          }
          res.status(200).json(result);
        } else {
          // Get all records
          const result = await getAllRecords(table);
          res.status(200).json(result);
        }
        break;
        
      case 'POST':
        // Create new record
        const newRecord = await createRecord(table, req.body);
        res.status(201).json(newRecord);
        break;
        
      case 'PUT':
        if (!id) {
          return res.status(400).json({ error: 'ID is required for update' });
        }
        // Update record
        const updatedRecord = await updateRecord(table, id, req.body);
        if (!updatedRecord) {
          return res.status(404).json({ error: `${table} not found` });
        }
        res.status(200).json(updatedRecord);
        break;
        
      case 'DELETE':
        if (!id) {
          return res.status(400).json({ error: 'ID is required for deletion' });
        }
        // Delete record
        const deleted = await deleteRecord(table, id);
        if (!deleted) {
          return res.status(404).json({ error: `${table} not found` });
        }
        res.status(200).json({ success: true });
        break;
        
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      details: error.message,
      table: table,
      method: method
    });
  } finally {
    await prisma.$disconnect();
  }
}

// Helper functions
async function getRecord(table, id) {
  switch (table) {
    case 'users':
      return await prisma.user.findUnique({ where: { id } });
    case 'printers':
      return await prisma.printer.findUnique({ where: { id } });
    case 'filaments':
      return await prisma.filament.findUnique({ where: { id } });
    case 'clients':
      return await prisma.client.findUnique({ where: { id } });
    case 'orders':
      return await prisma.order.findUnique({ where: { id } });
    case 'settings':
      return await prisma.settings.findUnique({ where: { id } });
    default:
      return null;
  }
}

async function getAllRecords(table) {
  switch (table) {
    case 'users':
      return await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
    case 'printers':
      return await prisma.printer.findMany({ orderBy: { createdAt: 'desc' } });
    case 'filaments':
      return await prisma.filament.findMany({ orderBy: { createdAt: 'desc' } });
    case 'clients':
      return await prisma.client.findMany({ orderBy: { createdAt: 'desc' } });
    case 'orders':
      return await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
    case 'settings':
      return await prisma.settings.findMany({ orderBy: { createdAt: 'desc' } });
    default:
      return [];
  }
}

async function createRecord(table, data) {
  switch (table) {
    case 'users':
      return await prisma.user.create({ data });
    case 'printers':
      return await prisma.printer.create({ data });
    case 'filaments':
      return await prisma.filament.create({ data });
    case 'clients':
      return await prisma.client.create({ data });
    case 'orders':
      return await prisma.order.create({ data });
    case 'settings':
      return await prisma.settings.create({ data });
    default:
      throw new Error(`Table ${table} not supported for creation`);
  }
}

async function updateRecord(table, id, data) {
  switch (table) {
    case 'users':
      return await prisma.user.update({ where: { id }, data });
    case 'printers':
      return await prisma.printer.update({ where: { id }, data });
    case 'filaments':
      return await prisma.filament.update({ where: { id }, data });
    case 'clients':
      return await prisma.client.update({ where: { id }, data });
    case 'orders':
      return await prisma.order.update({ where: { id }, data });
    case 'settings':
      return await prisma.settings.update({ where: { id }, data });
    default:
      return null;
  }
}

async function deleteRecord(table, id) {
  switch (table) {
    case 'users':
      await prisma.user.delete({ where: { id } });
      return true;
    case 'printers':
      await prisma.printer.delete({ where: { id } });
      return true;
    case 'filaments':
      await prisma.filament.delete({ where: { id } });
      return true;
    case 'clients':
      await prisma.client.delete({ where: { id } });
      return true;
    case 'orders':
      await prisma.order.delete({ where: { id } });
      return true;
    case 'settings':
      await prisma.settings.delete({ where: { id } });
      return true;
    default:
      return false;
  }
}
