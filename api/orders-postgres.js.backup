import { sql } from '@vercel/postgres';

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
          const result = await sql`SELECT * FROM orders WHERE id = ${id}`;
          if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
          }
          res.status(200).json(result.rows[0]);
        } else {
          // Get all orders
          const result = await sql`SELECT * FROM orders ORDER BY created_at DESC`;
          res.status(200).json(result.rows);
        }
        break;
      case 'POST':
        // Create new order
        const { 
          user_id, 
          task_name, 
          client_id, 
          client_name, 
          printer_id, 
          printer_name, 
          filament_id, 
          filament_name, 
          print_time_hours, 
          print_time_minutes, 
          weight, 
          markup, 
          status, 
          cost, 
          date 
        } = req.body;
        
        if (!user_id || !task_name || !client_id || !client_name || !printer_id || !printer_name || 
            !filament_id || !filament_name || !print_time_hours || !print_time_minutes || 
            !weight || !markup || !status || !cost || !date) {
          return res.status(400).json({ error: 'All fields are required' });
        }
        
        const newOrder = {
          id: crypto.randomUUID(),
          user_id,
          task_name,
          client_id,
          client_name,
          printer_id,
          printer_name,
          filament_id,
          filament_name,
          print_time_hours: parseInt(print_time_hours),
          print_time_minutes: parseInt(print_time_minutes),
          weight: parseFloat(weight),
          markup: parseFloat(markup),
          status,
          cost: parseFloat(cost),
          date,
          created_at: new Date().toISOString()
        };
        
        await sql`
          INSERT INTO orders (
            id, user_id, task_name, client_id, client_name, printer_id, printer_name, 
            filament_id, filament_name, print_time_hours, print_time_minutes, weight, 
            markup, status, cost, date, created_at
          )
          VALUES (
            ${newOrder.id}, ${newOrder.user_id}, ${newOrder.task_name}, ${newOrder.client_id}, 
            ${newOrder.client_name}, ${newOrder.printer_id}, ${newOrder.printer_name}, 
            ${newOrder.filament_id}, ${newOrder.filament_name}, ${newOrder.print_time_hours}, 
            ${newOrder.print_time_minutes}, ${newOrder.weight}, ${newOrder.markup}, 
            ${newOrder.status}, ${newOrder.cost}, ${newOrder.date}, ${newOrder.created_at}
          )
        `;
        
        res.status(201).json(newOrder);
        break;
      case 'PUT':
        if (!id) {
          return res.status(400).json({ error: 'Order ID is required' });
        }
        // Update order
        const updateFields = req.body;
        const updateResult = await sql`
          UPDATE orders 
          SET 
            user_id = ${updateFields.user_id},
            task_name = ${updateFields.task_name},
            client_id = ${updateFields.client_id},
            client_name = ${updateFields.client_name},
            printer_id = ${updateFields.printer_id},
            printer_name = ${updateFields.printer_name},
            filament_id = ${updateFields.filament_id},
            filament_name = ${updateFields.filament_name},
            print_time_hours = ${updateFields.print_time_hours},
            print_time_minutes = ${updateFields.print_time_minutes},
            weight = ${updateFields.weight},
            markup = ${updateFields.markup},
            status = ${updateFields.status},
            cost = ${updateFields.cost},
            date = ${updateFields.date}
          WHERE id = ${id}
          RETURNING *
        `;
        
        if (updateResult.rows.length === 0) {
          return res.status(404).json({ error: 'Order not found' });
        }
        
        res.status(200).json(updateResult.rows[0]);
        break;
      case 'DELETE':
        if (!id) {
          return res.status(400).json({ error: 'Order ID is required' });
        }
        // Delete order
        const deleteResult = await sql`DELETE FROM orders WHERE id = ${id} RETURNING *`;
        
        if (deleteResult.rows.length === 0) {
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
