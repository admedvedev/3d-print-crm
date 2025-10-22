import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Создание таблицы пользователей
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Создание таблицы принтеров
    await sql`
      CREATE TABLE IF NOT EXISTS printers (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        power INTEGER NOT NULL,
        cost DECIMAL(10,2) NOT NULL,
        depreciation DECIMAL(5,2) NOT NULL,
        total_hours INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Создание таблицы пластиков
    await sql`
      CREATE TABLE IF NOT EXISTS filaments (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        weight DECIMAL(10,3) NOT NULL,
        cost DECIMAL(10,2) NOT NULL,
        color VARCHAR(7) NOT NULL,
        in_stock BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Создание таблицы клиентов
    await sql`
      CREATE TABLE IF NOT EXISTS clients (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Создание таблицы заказов
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        task_name VARCHAR(255) NOT NULL,
        client_id VARCHAR(255) NOT NULL,
        client_name VARCHAR(255) NOT NULL,
        printer_id VARCHAR(255) NOT NULL,
        printer_name VARCHAR(255) NOT NULL,
        filament_id VARCHAR(255) NOT NULL,
        filament_name VARCHAR(255) NOT NULL,
        print_time_hours INTEGER NOT NULL,
        print_time_minutes INTEGER NOT NULL,
        weight DECIMAL(10,3) NOT NULL,
        markup DECIMAL(5,2) NOT NULL,
        status VARCHAR(50) NOT NULL,
        cost DECIMAL(10,2) NOT NULL,
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Создание таблицы настроек
    await sql`
      CREATE TABLE IF NOT EXISTS settings (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        electricity_rate DECIMAL(5,2) NOT NULL,
        currency VARCHAR(10) NOT NULL,
        default_markup DECIMAL(5,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Вставка начальных данных
    await sql`
      INSERT INTO users (id, email, password, name) 
      VALUES ('1', 'andybear@3dcrm.com', 'pass111word', 'Администратор')
      ON CONFLICT (id) DO NOTHING
    `;

    await sql`
      INSERT INTO printers (id, user_id, name, power, cost, depreciation, total_hours) 
      VALUES ('1', '1', 'Prusa i3 MK3S', 220, 25000.00, 10.00, 150)
      ON CONFLICT (id) DO NOTHING
    `;

    await sql`
      INSERT INTO filaments (id, user_id, name, weight, cost, color, in_stock) 
      VALUES ('1', '1', 'PLA Базовый', 1.000, 800.00, '#FF6B6B', true)
      ON CONFLICT (id) DO NOTHING
    `;

    await sql`
      INSERT INTO clients (id, user_id, name, email, phone) 
      VALUES ('1', '1', 'Иванов И.И.', 'ivanov@example.com', '+7 (999) 123-45-67')
      ON CONFLICT (id) DO NOTHING
    `;

    await sql`
      INSERT INTO orders (id, user_id, task_name, client_id, client_name, printer_id, printer_name, filament_id, filament_name, print_time_hours, print_time_minutes, weight, markup, status, cost, date) 
      VALUES ('1', '1', 'Тестовое задание', '1', 'Иванов И.И.', '1', 'Prusa i3 MK3S', '1', 'PLA Базовый', 2, 30, 50.000, 20.00, 'completed', 1250.50, '2024-01-15')
      ON CONFLICT (id) DO NOTHING
    `;

    await sql`
      INSERT INTO settings (id, user_id, electricity_rate, currency, default_markup) 
      VALUES ('1', '1', 5.50, '₽', 20.00)
      ON CONFLICT (id) DO NOTHING
    `;

    res.status(200).json({ 
      message: 'Database initialized successfully',
      tables: ['users', 'printers', 'filaments', 'clients', 'orders', 'settings']
    });
  } catch (error) {
    console.error('Database initialization error:', error);
    res.status(500).json({ 
      error: 'Failed to initialize database',
      details: error.message 
    });
  }
}
