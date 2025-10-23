# 🗄️ Создание таблиц в базе данных Vercel

## 📋 Пошаговая инструкция

### 1. Получение URL базы данных из Vercel

1. **Откройте [vercel.com](https://vercel.com)**
2. **Перейдите в ваш проект `3d-print-crm`**
3. **Перейдите в Settings → Environment Variables**
4. **Найдите переменную `POSTGRES_PRISMA_URL`**
5. **Скопируйте значение** (начинается с `postgres://`)

### 2. Создание локального .env файла

Создайте файл `.env` в корне проекта:

```env
POSTGRES_PRISMA_URL="postgres://default:password@ep-xxx.us-east-1.postgres.vercel-storage.com/verceldb?pgbouncer=true&connect_timeout=15"
```

**Замените URL на ваш реальный из Vercel!**

### 3. Создание миграции

Выполните команды в терминале:

```bash
# Сгенерировать Prisma клиент
npx prisma generate

# Создать миграцию
npx prisma migrate dev --name init

# Применить миграцию к базе данных
npx prisma db push
```

### 4. Альтернативный способ - через Vercel

Если локальная настройка не работает, можно создать таблицы через Vercel:

#### Создайте файл `api/create-tables.js`:

```javascript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Создаем таблицы через Prisma
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "email" TEXT NOT NULL UNIQUE,
        "password" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL
      );
    `;

    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Printer" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "user_id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "power" DOUBLE PRECISION NOT NULL,
        "cost" DOUBLE PRECISION NOT NULL,
        "depreciation" DOUBLE PRECISION NOT NULL,
        "total_hours" DOUBLE PRECISION NOT NULL,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL
      );
    `;

    // Добавьте остальные таблицы...

    res.status(200).json({ message: 'Tables created successfully' });
  } catch (error) {
    console.error('Error creating tables:', error);
    res.status(500).json({ error: error.message });
  } finally {
    await prisma.$disconnect();
  }
}
```

### 5. Инициализация данных

После создания таблиц инициализируйте данные:

```bash
# Вызовите API endpoint
curl -X POST https://your-app.vercel.app/api/init-db
```

### 6. Проверка работы

1. **Health Check:** `https://your-app.vercel.app/api/health`
2. **Откройте сайт** и проверьте, что данные сохраняются

## 🚨 Решение проблем

### Ошибка "Environment variable not found"
- Убедитесь, что `.env` файл создан
- Проверьте правильность URL базы данных

### Ошибка "Connection refused"
- Проверьте, что база данных активна в Vercel
- Убедитесь, что URL правильный

### Ошибка "Table already exists"
- Это нормально, таблицы уже созданы
- Пропустите создание таблиц

## ✅ Проверочный список

- [ ] URL базы данных скопирован из Vercel
- [ ] Файл `.env` создан с правильным URL
- [ ] Prisma клиент сгенерирован (`npx prisma generate`)
- [ ] Миграция создана (`npx prisma migrate dev --name init`)
- [ ] Таблицы созданы в базе данных
- [ ] Данные инициализированы (`/api/init-db`)
- [ ] Health check показывает "connected"
- [ ] Данные сохраняются на сайте

## 🎯 Результат

После выполнения всех шагов у вас будет:
- ✅ Полноценная база данных PostgreSQL
- ✅ Все таблицы созданы
- ✅ Начальные данные загружены
- ✅ Постоянное сохранение данных
