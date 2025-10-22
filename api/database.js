import { sql } from '@vercel/postgres';

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
    // Проверяем существование таблицы
    const tableExists = await sql.query(
      `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = $1)`,
      [table]
    );
    
    if (!tableExists.rows[0].exists) {
      return res.status(404).json({ 
        error: `Table ${table} does not exist`,
        suggestion: 'Run /api/init-db first to initialize the database'
      });
    }

    switch (method) {
      case 'GET':
        if (id) {
          // Get single record
          const result = await sql.query(`SELECT * FROM ${table} WHERE id = $1`, [id]);
          if (result.rows.length === 0) {
            return res.status(404).json({ error: `${table} not found` });
          }
          // Convert numeric fields to numbers
          const processedRow = convertNumericFields(result.rows[0], table);
          res.status(200).json(processedRow);
        } else {
          // Get all records
          const result = await sql.query(`SELECT * FROM ${table} ORDER BY created_at DESC`);
          // Convert numeric fields to numbers
          const processedRows = result.rows.map(row => convertNumericFields(row, table));
          res.status(200).json(processedRows);
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
  }
}

// Функция создания записи
async function createRecord(table, data) {
  const id = 'id-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now();
  const createdAt = new Date().toISOString();
  
  switch (table) {
    case 'users':
      const { email, password, name } = data;
      if (!email || !password || !name) {
        throw new Error('Email, password, and name are required');
      }
      await sql.query(
        `INSERT INTO users (id, email, password, name, created_at) VALUES ($1, $2, $3, $4, $5)`,
        [id, email, password, name, createdAt]
      );
      const newUser = { id, email, password, name, created_at: createdAt };
      return convertNumericFields(newUser, 'users');
      
    default:
      throw new Error(`Table ${table} not supported for creation yet`);
  }
}

// Функция обновления записи
async function updateRecord(table, id, data) {
  switch (table) {
    case 'users':
      const { email, password, name } = data;
      const userResult = await sql.query(
        `UPDATE users SET email = $1, password = $2, name = $3 WHERE id = $4 RETURNING *`,
        [email, password, name, id]
      );
      return userResult.rows.length > 0 ? convertNumericFields(userResult.rows[0], 'users') : null;
      
    default:
      throw new Error(`Table ${table} not supported for update yet`);
  }
}

// Функция удаления записи
async function deleteRecord(table, id) {
  const result = await sql.query(`DELETE FROM ${table} WHERE id = $1 RETURNING *`, [id]);
  return result.rows.length > 0;
}

// Функция преобразования строковых числовых полей в числа
function convertNumericFields(row, table) {
  if (!row) return row;
  
  const processedRow = { ...row };
  
  // Определяем числовые поля для каждой таблицы
  const numericFields = {
    users: [],
    printers: ['power', 'cost', 'depreciation', 'total_hours'],
    filaments: ['weight', 'cost'],
    clients: [],
    orders: ['print_time_hours', 'print_time_minutes', 'weight', 'markup', 'cost'],
    settings: ['electricity_rate', 'default_markup']
  };
  
  const fields = numericFields[table] || [];
  
  fields.forEach(field => {
    if (processedRow[field] !== null && processedRow[field] !== undefined) {
      const numValue = parseFloat(processedRow[field]);
      if (!isNaN(numValue)) {
        processedRow[field] = numValue;
      }
    }
  });
  
  return processedRow;
}
