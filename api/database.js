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
          const result = await sql`SELECT * FROM ${sql(table)} WHERE id = ${id}`;
          if (result.rows.length === 0) {
            return res.status(404).json({ error: `${table} not found` });
          }
          res.status(200).json(result.rows[0]);
        } else {
          // Get all records
          const result = await sql`SELECT * FROM ${sql(table)} ORDER BY created_at DESC`;
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
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Функция создания записи
async function createRecord(table, data) {
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  
  switch (table) {
    case 'users':
      const { email, password, name } = data;
      if (!email || !password || !name) {
        throw new Error('Email, password, and name are required');
      }
      await sql`
        INSERT INTO users (id, email, password, name, created_at)
        VALUES (${id}, ${email}, ${password}, ${name}, ${createdAt})
      `;
      return { id, email, password, name, created_at: createdAt };
      
    case 'printers':
      const { user_id, name, power, cost, depreciation, total_hours } = data;
      if (!user_id || !name || !power || !cost || !depreciation || !total_hours) {
        throw new Error('All fields are required');
      }
      await sql`
        INSERT INTO printers (id, user_id, name, power, cost, depreciation, total_hours, created_at)
        VALUES (${id}, ${user_id}, ${name}, ${power}, ${cost}, ${depreciation}, ${total_hours}, ${createdAt})
      `;
      return { id, user_id, name, power, cost, depreciation, total_hours, created_at: createdAt };
      
    case 'filaments':
      const { user_id: f_user_id, name: f_name, weight, cost: f_cost, color, in_stock } = data;
      if (!f_user_id || !f_name || !weight || !f_cost || !color) {
        throw new Error('All required fields must be provided');
      }
      await sql`
        INSERT INTO filaments (id, user_id, name, weight, cost, color, in_stock, created_at)
        VALUES (${id}, ${f_user_id}, ${f_name}, ${weight}, ${f_cost}, ${color}, ${in_stock !== undefined ? in_stock : true}, ${createdAt})
      `;
      return { id, user_id: f_user_id, name: f_name, weight, cost: f_cost, color, in_stock: in_stock !== undefined ? in_stock : true, created_at: createdAt };
      
    case 'clients':
      const { user_id: c_user_id, name: c_name, email, phone } = data;
      if (!c_user_id || !c_name || !email || !phone) {
        throw new Error('All fields are required');
      }
      await sql`
        INSERT INTO clients (id, user_id, name, email, phone, created_at)
        VALUES (${id}, ${c_user_id}, ${c_name}, ${email}, ${phone}, ${createdAt})
      `;
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
      await sql`
        INSERT INTO orders (
          id, user_id, task_name, client_id, client_name, printer_id, printer_name, 
          filament_id, filament_name, print_time_hours, print_time_minutes, weight, 
          markup, status, cost, date, created_at
        )
        VALUES (
          ${id}, ${o_user_id}, ${task_name}, ${client_id}, ${client_name}, ${printer_id}, ${printer_name}, 
          ${filament_id}, ${filament_name}, ${print_time_hours}, ${print_time_minutes}, ${o_weight}, 
          ${markup}, ${status}, ${o_cost}, ${date}, ${createdAt}
        )
      `;
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
      await sql`
        INSERT INTO settings (id, user_id, electricity_rate, currency, default_markup, created_at)
        VALUES (${id}, ${s_user_id}, ${electricity_rate}, ${currency}, ${default_markup}, ${createdAt})
      `;
      return { id, user_id: s_user_id, electricity_rate, currency, default_markup, created_at: createdAt };
      
    default:
      throw new Error('Invalid table name');
  }
}

// Функция обновления записи
async function updateRecord(table, id, data) {
  const updateFields = Object.keys(data).map(key => `${key} = $${key}`).join(', ');
  const values = Object.values(data);
  
  const result = await sql`
    UPDATE ${sql(table)} 
    SET ${sql(updateFields)}
    WHERE id = ${id}
    RETURNING *
  `;
  
  return result.rows.length > 0 ? result.rows[0] : null;
}

// Функция удаления записи
async function deleteRecord(table, id) {
  const result = await sql`DELETE FROM ${sql(table)} WHERE id = ${id} RETURNING *`;
  return result.rows.length > 0;
}
