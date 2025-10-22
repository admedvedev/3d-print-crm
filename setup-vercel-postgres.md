# Настройка Vercel Postgres

## 1. Установка Vercel Postgres
```bash
# В корне проекта
npx vercel postgres create 3d-print-crm-db
```

## 2. Установка зависимостей
```bash
npm install @vercel/postgres
```

## 3. Создание таблиц
Создайте файл `api/init-db.js`:

```javascript
import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  try {
    // Создание таблиц
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

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

    res.status(200).json({ message: 'Database initialized successfully' });
  } catch (error) {
    console.error('Database initialization error:', error);
    res.status(500).json({ error: 'Failed to initialize database' });
  }
}
```

## 4. Обновление API endpoints
Замените in-memory хранилище на Postgres запросы в каждом API endpoint.

## 5. Переменные окружения
Vercel автоматически добавит переменные:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
