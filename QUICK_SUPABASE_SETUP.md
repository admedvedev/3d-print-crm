# ⚡ Быстрая настройка Supabase за 5 минут

## 🎯 Что нужно сделать

### 1. Создать проект Supabase (2 минуты)

1. **Идите на [supabase.com](https://supabase.com)**
2. **Нажмите "Start your project"**
3. **Войдите через GitHub**
4. **Создайте проект:**
   - Name: `3d-print-crm`
   - Password: придумайте пароль (запомните!)
   - Region: выберите ближайший

### 2. Получить ключи (1 минута)

1. **В проекте перейдите в Settings → API**
2. **Скопируйте:**
   - **Project URL** (начинается с `https://`)
   - **anon public key** (начинается с `eyJ`)

### 3. Создать таблицы (1 минута)

1. **Перейдите в SQL Editor** (иконка `</>`)
2. **Нажмите "New query"**
3. **Скопируйте и вставьте ВЕСЬ код ниже:**
4. **Нажмите "Run"**

```sql
-- Создание всех таблиц
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

CREATE TABLE clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

-- Включение RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE printers ENABLE ROW LEVEL SECURITY;
ALTER TABLE filaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Создание политик безопасности
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid()::text = id::text);
CREATE POLICY "Users can insert own data" ON users FOR INSERT WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "Users can view own printers" ON printers FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert own printers" ON printers FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own printers" ON printers FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete own printers" ON printers FOR DELETE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own filaments" ON filaments FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert own filaments" ON filaments FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own filaments" ON filaments FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete own filaments" ON filaments FOR DELETE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own clients" ON clients FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert own clients" ON clients FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own clients" ON clients FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete own clients" ON clients FOR DELETE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert own orders" ON orders FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own orders" ON orders FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete own orders" ON orders FOR DELETE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own settings" ON settings FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert own settings" ON settings FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own settings" ON settings FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete own settings" ON settings FOR DELETE USING (auth.uid()::text = user_id::text);
```

### 4. Настроить Vercel (1 минута)

1. **Идите в Vercel Dashboard**
2. **Выберите ваш проект**
3. **Settings → Environment Variables**
4. **Добавьте переменные:**
   - `VITE_SUPABASE_URL` = ваш Project URL
   - `VITE_SUPABASE_ANON_KEY` = ваш anon public key
5. **Нажмите "Save"**

### 5. Развернуть проект

```bash
git push origin main
```

## ✅ Готово!

Теперь ваш сайт будет использовать Supabase для хранения данных!

## 🔍 Проверка

1. **Откройте ваш сайт на Vercel**
2. **Войдите с тестовым аккаунтом**
3. **Добавьте принтер или клиента**
4. **Проверьте в Supabase → Table Editor** - данные должны появиться

## 🆘 Если что-то не работает

1. **Проверьте, что все SQL выполнился без ошибок**
2. **Убедитесь, что переменные окружения настроены в Vercel**
3. **Проверьте, что проект переразвернулся после добавления переменных**
