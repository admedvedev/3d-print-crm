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
    switch (method) {
      case 'GET':
        if (id) {
          // Get single record
          const result = await sql.query(`SELECT * FROM ${table} WHERE id = $1`, [id]);
          if (result.rows.length === 0) {
            return res.status(404).json({ error: `${table} not found` });
          }
          res.status(200).json(result.rows[0]);
        } else {
          // Get all records
          const result = await sql.query(`SELECT * FROM ${table} ORDER BY created_at DESC`);
          res.status(200).json(result.rows);
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
      details: error.message 
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
      return { id, email, password, name, created_at: createdAt };
      
    case 'printers':
      const { user_id, name, power, cost, depreciation, total_hours } = data;
      if (!user_id || !name || !power || !cost || !depreciation || !total_hours) {
        throw new Error('All fields are required');
      }
      await sql.query(
        `INSERT INTO printers (id, user_id, name, power, cost, depreciation, total_hours, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [id, user_id, name, power, cost, depreciation, total_hours, createdAt]
      );
      return { id, user_id, name, power, cost, depreciation, total_hours, created_at: createdAt };
      
    case 'filaments':
      const { user_id: f_user_id, name: f_name, weight, cost: f_cost, color, in_stock } = data;
      if (!f_user_id || !f_name || !weight || !f_cost || !color) {
        throw new Error('All required fields must be provided');
      }
      await sql.query(
        `INSERT INTO filaments (id, user_id, name, weight, cost, color, in_stock, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [id, f_user_id, f_name, weight, f_cost, color, in_stock !== undefined ? in_stock : true, createdAt]
      );
      return { id, user_id: f_user_id, name: f_name, weight, cost: f_cost, color, in_stock: in_stock !== undefined ? in_stock : true, created_at: createdAt };
      
    case 'clients':
      const { user_id: c_user_id, name: c_name, email, phone } = data;
      if (!c_user_id || !c_name || !email || !phone) {
        throw new Error('All fields are required');
      }
      await sql.query(
        `INSERT INTO clients (id, user_id, name, email, phone, created_at) VALUES ($1, $2, $3, $4, $5, $6)`,
        [id, c_user_id, c_name, email, phone, createdAt]
      );
      return { id, user_id: c_user_id, name: c_name, email, phone, created_at: createdAt };
      
    case 'orders':
      const { 
        user_id: o_user_id, task_name, client_id, client_name, printer_id, printer_name, 
        filament_id, filament_name, print_time_hours, print_time_minutes, 
        weight: o_weight, markup, status, cost: o_cost, date 
      } = data;
      if (!o_user_id || !task_name || !client_id || !client_name || !printer_id || !printer_name || 
          !filament_id || !filament_name || !print_time_hours || !print_time_minutes || 
          !o_weight || !markup || !status || !o_cost || !date) {
        throw new Error('All fields are required');
      }
      await sql.query(
        `INSERT INTO orders (id, user_id, task_name, client_id, client_name, printer_id, printer_name, filament_id, filament_name, print_time_hours, print_time_minutes, weight, markup, status, cost, date, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
        [id, o_user_id, task_name, client_id, client_name, printer_id, printer_name, filament_id, filament_name, print_time_hours, print_time_minutes, o_weight, markup, status, o_cost, date, createdAt]
      );
      return { 
        id, user_id: o_user_id, task_name, client_id, client_name, printer_id, printer_name, 
        filament_id, filament_name, print_time_hours, print_time_minutes, weight: o_weight, 
        markup, status, cost: o_cost, date, created_at: createdAt 
      };
      
    case 'settings':
      const { user_id: s_user_id, electricity_rate, currency, default_markup } = data;
      if (!s_user_id || !electricity_rate || !currency || !default_markup) {
        throw new Error('All fields are required');
      }
      await sql.query(
        `INSERT INTO settings (id, user_id, electricity_rate, currency, default_markup, created_at) VALUES ($1, $2, $3, $4, $5, $6)`,
        [id, s_user_id, electricity_rate, currency, default_markup, createdAt]
      );
      return { id, user_id: s_user_id, electricity_rate, currency, default_markup, created_at: createdAt };
      
    default:
      throw new Error('Invalid table name');
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
      return userResult.rows.length > 0 ? userResult.rows[0] : null;
      
    case 'printers':
      const { user_id, name: p_name, power, cost, depreciation, total_hours } = data;
      const printerResult = await sql.query(
        `UPDATE printers SET user_id = $1, name = $2, power = $3, cost = $4, depreciation = $5, total_hours = $6 WHERE id = $7 RETURNING *`,
        [user_id, p_name, power, cost, depreciation, total_hours, id]
      );
      return printerResult.rows.length > 0 ? printerResult.rows[0] : null;
      
    case 'filaments':
      const { user_id: f_user_id, name: f_name, weight, cost: f_cost, color, in_stock } = data;
      const filamentResult = await sql.query(
        `UPDATE filaments SET user_id = $1, name = $2, weight = $3, cost = $4, color = $5, in_stock = $6 WHERE id = $7 RETURNING *`,
        [f_user_id, f_name, weight, f_cost, color, in_stock, id]
      );
      return filamentResult.rows.length > 0 ? filamentResult.rows[0] : null;
      
    case 'clients':
      const { user_id: c_user_id, name: c_name, email, phone } = data;
      const clientResult = await sql.query(
        `UPDATE clients SET user_id = $1, name = $2, email = $3, phone = $4 WHERE id = $5 RETURNING *`,
        [c_user_id, c_name, email, phone, id]
      );
      return clientResult.rows.length > 0 ? clientResult.rows[0] : null;
      
    case 'orders':
      const { 
        user_id: o_user_id, task_name, client_id, client_name, printer_id, printer_name, 
        filament_id, filament_name, print_time_hours, print_time_minutes, 
        weight: o_weight, markup, status, cost: o_cost, date 
      } = data;
      const orderResult = await sql.query(
        `UPDATE orders SET user_id = $1, task_name = $2, client_id = $3, client_name = $4, printer_id = $5, printer_name = $6, filament_id = $7, filament_name = $8, print_time_hours = $9, print_time_minutes = $10, weight = $11, markup = $12, status = $13, cost = $14, date = $15 WHERE id = $16 RETURNING *`,
        [o_user_id, task_name, client_id, client_name, printer_id, printer_name, filament_id, filament_name, print_time_hours, print_time_minutes, o_weight, markup, status, o_cost, date, id]
      );
      return orderResult.rows.length > 0 ? orderResult.rows[0] : null;
      
    case 'settings':
      const { user_id: s_user_id, electricity_rate, currency, default_markup } = data;
      const settingsResult = await sql.query(
        `UPDATE settings SET user_id = $1, electricity_rate = $2, currency = $3, default_markup = $4 WHERE id = $5 RETURNING *`,
        [s_user_id, electricity_rate, currency, default_markup, id]
      );
      return settingsResult.rows.length > 0 ? settingsResult.rows[0] : null;
      
    default:
      return null;
  }
}

// Функция удаления записи
async function deleteRecord(table, id) {
  const result = await sql.query(`DELETE FROM ${table} WHERE id = $1 RETURNING *`, [id]);
  return result.rows.length > 0;
}
