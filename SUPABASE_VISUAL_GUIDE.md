# 🖼️ Визуальная инструкция по настройке Supabase

## 📱 Пошаговые скриншоты

### 1. Создание проекта Supabase

1. **Перейдите на [supabase.com](https://supabase.com)**
2. **Нажмите "Start your project"**
3. **Войдите через GitHub**

![Шаг 1: Вход в Supabase](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=1.+Вход+в+Supabase)

4. **Создайте новый проект:**
   - **Name**: `3d-print-crm`
   - **Database Password**: создайте надежный пароль
   - **Region**: выберите ближайший

![Шаг 2: Создание проекта](https://via.placeholder.com/800x400/10B981/FFFFFF?text=2.+Создание+проекта)

### 2. Получение данных подключения

1. **Перейдите в Settings → API**
2. **Скопируйте Project URL и anon public key**

![Шаг 3: Получение ключей](https://via.placeholder.com/800x400/F59E0B/FFFFFF?text=3.+Получение+ключей)

### 3. Создание таблиц

1. **Перейдите в SQL Editor** (иконка `</>`)
2. **Нажмите "New query"**
3. **Вставьте SQL код для создания таблиц**

![Шаг 4: SQL Editor](https://via.placeholder.com/800x400/8B5CF6/FFFFFF?text=4.+SQL+Editor)

### 4. Настройка политик безопасности

1. **В SQL Editor выполните код для RLS**
2. **Или используйте Authentication → Policies**

![Шаг 5: Настройка RLS](https://via.placeholder.com/800x400/EF4444/FFFFFF?text=5.+Настройка+RLS)

### 5. Настройка переменных в Vercel

1. **Перейдите в Vercel Dashboard**
2. **Выберите ваш проект**
3. **Settings → Environment Variables**
4. **Добавьте переменные**

![Шаг 6: Настройка Vercel](https://via.placeholder.com/800x400/06B6D4/FFFFFF?text=6.+Настройка+Vercel)

## 🎯 Быстрая настройка (копируйте по частям)

### Часть 1: Создание таблиц

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
```

**Нажмите "Run"** ✅

### Часть 2: Вставка тестовых данных

```sql
-- Вставка тестовых пользователей
INSERT INTO users (id, email, password, name) VALUES 
  ('00000000-0000-0000-0000-000000000001', 'andybear@3dcrm.com', 'pass111word', 'Администратор'),
  ('00000000-0000-0000-0000-000000000002', 'admin@3dcrm.com', 'pass1111word', 'Админ');

-- Вставка настроек по умолчанию
INSERT INTO settings (user_id, electricity_rate, currency, default_markup) VALUES 
  ('00000000-0000-0000-0000-000000000001', 5.5, '₽', 20),
  ('00000000-0000-0000-0000-000000000002', 5.5, '₽', 20);
```

**Нажмите "Run"** ✅

### Часть 3: Включение RLS

```sql
-- Включение RLS для всех таблиц
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE printers ENABLE ROW LEVEL SECURITY;
ALTER TABLE filaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
```

**Нажмите "Run"** ✅

### Часть 4: Создание политик (выполняйте по одной таблице)

```sql
-- Политики для пользователей
CREATE POLICY "Users can view own data" ON users 
FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data" ON users 
FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert own data" ON users 
FOR INSERT WITH CHECK (auth.uid()::text = id::text);
```

**Нажмите "Run"** ✅

```sql
-- Политики для принтеров
CREATE POLICY "Users can view own printers" ON printers 
FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own printers" ON printers 
FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own printers" ON printers 
FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own printers" ON printers 
FOR DELETE USING (auth.uid()::text = user_id::text);
```

**Нажмите "Run"** ✅

Продолжите аналогично для остальных таблиц...

## ✅ Проверка

После выполнения всех шагов:

1. **Перейдите в "Table Editor"**
2. **Вы должны увидеть все созданные таблицы**
3. **В "Authentication" → "Policies"** должны быть все политики
4. **Протестируйте на сайте** - данные должны сохраняться
