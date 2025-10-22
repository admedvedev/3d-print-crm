# Настройка Supabase для Vercel

## 1. Создание проекта Supabase
1. Перейдите на https://supabase.com
2. Создайте новый проект
3. Получите URL и API ключ

## 2. Установка зависимостей
```bash
npm install @supabase/supabase-js
```

## 3. Создание клиента Supabase
Создайте файл `lib/supabase.js`:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
```

## 4. Настройка переменных окружения в Vercel
Добавьте в настройки проекта Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 5. Создание таблиц в Supabase
Выполните SQL в Supabase Dashboard:

```sql
-- Таблица пользователей
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица принтеров
CREATE TABLE printers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  power INTEGER NOT NULL,
  cost DECIMAL(10,2) NOT NULL,
  depreciation DECIMAL(5,2) NOT NULL,
  total_hours INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- И так далее для остальных таблиц...
```

## 6. Обновление API endpoints
Используйте Supabase клиент вместо in-memory хранилища.
