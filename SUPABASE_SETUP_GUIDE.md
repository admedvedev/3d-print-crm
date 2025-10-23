# 🗄️ Настройка Supabase для проекта

## 📋 Пошаговая инструкция

### 1. Создание проекта Supabase

1. **Перейдите на [supabase.com](https://supabase.com)**
2. **Нажмите "Start your project"**
3. **Войдите через GitHub** (рекомендуется)
4. **Создайте новый проект:**
   - **Name**: `3d-print-crm`
   - **Database Password**: создайте надежный пароль (сохраните!)
   - **Region**: выберите ближайший к вам
5. **Нажмите "Create new project"**

### 2. Получение данных подключения

После создания проекта:

1. **Перейдите в Settings → API**
2. **Скопируйте:**
   - **Project URL** (начинается с `https://`)
   - **anon public key** (начинается с `eyJ`)
   - **service_role key** (начинается с `eyJ`)

### 3. Создание таблиц в Supabase

Перейдите в **SQL Editor** и выполните:

```sql
-- Создание таблицы пользователей
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы принтеров
CREATE TABLE printers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  power DECIMAL NOT NULL,
  cost DECIMAL NOT NULL,
  depreciation DECIMAL NOT NULL,
  total_hours DECIMAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы пластиков
CREATE TABLE filaments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  weight DECIMAL NOT NULL,
  cost DECIMAL NOT NULL,
  color TEXT NOT NULL,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы клиентов
CREATE TABLE clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы заказов
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  task_name TEXT NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  printer_id UUID REFERENCES printers(id) ON DELETE CASCADE,
  printer_name TEXT NOT NULL,
  filament_id UUID REFERENCES filaments(id) ON DELETE CASCADE,
  filament_name TEXT NOT NULL,
  print_time_hours INTEGER NOT NULL,
  print_time_minutes INTEGER NOT NULL,
  weight DECIMAL NOT NULL,
  markup DECIMAL NOT NULL,
  status TEXT NOT NULL,
  cost DECIMAL NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы настроек
CREATE TABLE settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  electricity_rate DECIMAL NOT NULL,
  currency TEXT NOT NULL,
  default_markup DECIMAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Вставка тестовых пользователей
INSERT INTO users (id, email, password, name) VALUES 
  ('00000000-0000-0000-0000-000000000001', 'andybear@3dcrm.com', 'pass111word', 'Администратор'),
  ('00000000-0000-0000-0000-000000000002', 'admin@3dcrm.com', 'pass1111word', 'Админ');

-- Вставка настроек по умолчанию
INSERT INTO settings (user_id, electricity_rate, currency, default_markup) VALUES 
  ('00000000-0000-0000-0000-000000000001', 5.5, '₽', 20),
  ('00000000-0000-0000-0000-000000000002', 5.5, '₽', 20);
```

### 4. Настройка RLS (Row Level Security)

Выполните в SQL Editor:

```sql
-- Включение RLS для всех таблиц
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE printers ENABLE ROW LEVEL SECURITY;
ALTER TABLE filaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Политики для пользователей
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid()::text = id::text);

-- Политики для принтеров
CREATE POLICY "Users can view own printers" ON printers FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert own printers" ON printers FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own printers" ON printers FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete own printers" ON printers FOR DELETE USING (auth.uid()::text = user_id::text);

-- Аналогичные политики для других таблиц...
```

### 5. Настройка переменных окружения в Vercel

1. **Перейдите в Vercel Dashboard**
2. **Выберите ваш проект**
3. **Перейдите в Settings → Environment Variables**
4. **Добавьте переменные:**
   - `NEXT_PUBLIC_SUPABASE_URL` = ваш Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = ваш anon public key

### 6. Установка зависимостей

```bash
npm install @supabase/supabase-js
```

### 7. Развертывание

```bash
git add .
git commit -m "Add Supabase integration"
git push origin main
```

## ✅ Проверка работы

1. **Откройте ваш сайт на Vercel**
2. **Войдите с тестовым аккаунтом**
3. **Добавьте принтер или клиента**
4. **Проверьте в Supabase Dashboard** - данные должны появиться

## 🎯 Преимущества Supabase

- ✅ **Бесплатный план** - 500MB, 2GB bandwidth
- ✅ **PostgreSQL** - надежная база данных
- ✅ **Real-time** - обновления в реальном времени
- ✅ **Автоматические API** - REST и GraphQL
- ✅ **Аутентификация** - встроенная система
- ✅ **Row Level Security** - безопасность данных
