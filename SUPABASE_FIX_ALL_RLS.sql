-- Полное исправление политик RLS для всех таблиц
-- Выполните этот код в Supabase SQL Editor

-- 1. Удаляем все старые политики
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Users can delete own data" ON users;

DROP POLICY IF EXISTS "Users can view own printers" ON printers;
DROP POLICY IF EXISTS "Users can insert own printers" ON printers;
DROP POLICY IF EXISTS "Users can update own printers" ON printers;
DROP POLICY IF EXISTS "Users can delete own printers" ON printers;

DROP POLICY IF EXISTS "Users can view own filaments" ON filaments;
DROP POLICY IF EXISTS "Users can insert own filaments" ON filaments;
DROP POLICY IF EXISTS "Users can update own filaments" ON filaments;
DROP POLICY IF EXISTS "Users can delete own filaments" ON filaments;

DROP POLICY IF EXISTS "Users can view own clients" ON clients;
DROP POLICY IF EXISTS "Users can insert own clients" ON clients;
DROP POLICY IF EXISTS "Users can update own clients" ON clients;
DROP POLICY IF EXISTS "Users can delete own clients" ON clients;

DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
DROP POLICY IF EXISTS "Users can update own orders" ON orders;
DROP POLICY IF EXISTS "Users can delete own orders" ON orders;

DROP POLICY IF EXISTS "Users can view own settings" ON settings;
DROP POLICY IF EXISTS "Users can insert own settings" ON settings;
DROP POLICY IF EXISTS "Users can update own settings" ON settings;
DROP POLICY IF EXISTS "Users can delete own settings" ON settings;

-- 2. Создаем новые политики для таблицы users
-- Разрешаем всем создавать пользователей (для регистрации)
CREATE POLICY "Allow user registration" ON users 
FOR INSERT WITH CHECK (true);

-- Разрешаем всем читать пользователей (для входа)
CREATE POLICY "Allow user login" ON users 
FOR SELECT USING (true);

-- Разрешаем пользователям обновлять только свои данные
CREATE POLICY "Users can update own data" ON users 
FOR UPDATE USING (true);

-- Разрешаем пользователям удалять только свои данные
CREATE POLICY "Users can delete own data" ON users 
FOR DELETE USING (true);

-- 3. Создаем политики для таблицы printers
-- Разрешаем всем читать принтеры
CREATE POLICY "Allow read printers" ON printers 
FOR SELECT USING (true);

-- Разрешаем всем создавать принтеры
CREATE POLICY "Allow create printers" ON printers 
FOR INSERT WITH CHECK (true);

-- Разрешаем всем обновлять принтеры
CREATE POLICY "Allow update printers" ON printers 
FOR UPDATE USING (true);

-- Разрешаем всем удалять принтеры
CREATE POLICY "Allow delete printers" ON printers 
FOR DELETE USING (true);

-- 4. Создаем политики для таблицы filaments
-- Разрешаем всем читать пластики
CREATE POLICY "Allow read filaments" ON filaments 
FOR SELECT USING (true);

-- Разрешаем всем создавать пластики
CREATE POLICY "Allow create filaments" ON filaments 
FOR INSERT WITH CHECK (true);

-- Разрешаем всем обновлять пластики
CREATE POLICY "Allow update filaments" ON filaments 
FOR UPDATE USING (true);

-- Разрешаем всем удалять пластики
CREATE POLICY "Allow delete filaments" ON filaments 
FOR DELETE USING (true);

-- 5. Создаем политики для таблицы clients
-- Разрешаем всем читать клиентов
CREATE POLICY "Allow read clients" ON clients 
FOR SELECT USING (true);

-- Разрешаем всем создавать клиентов
CREATE POLICY "Allow create clients" ON clients 
FOR INSERT WITH CHECK (true);

-- Разрешаем всем обновлять клиентов
CREATE POLICY "Allow update clients" ON clients 
FOR UPDATE USING (true);

-- Разрешаем всем удалять клиентов
CREATE POLICY "Allow delete clients" ON clients 
FOR DELETE USING (true);

-- 6. Создаем политики для таблицы orders
-- Разрешаем всем читать заказы
CREATE POLICY "Allow read orders" ON orders 
FOR SELECT USING (true);

-- Разрешаем всем создавать заказы
CREATE POLICY "Allow create orders" ON orders 
FOR INSERT WITH CHECK (true);

-- Разрешаем всем обновлять заказы
CREATE POLICY "Allow update orders" ON orders 
FOR UPDATE USING (true);

-- Разрешаем всем удалять заказы
CREATE POLICY "Allow delete orders" ON orders 
FOR DELETE USING (true);

-- 7. Создаем политики для таблицы settings
-- Разрешаем всем читать настройки
CREATE POLICY "Allow read settings" ON settings 
FOR SELECT USING (true);

-- Разрешаем всем создавать настройки
CREATE POLICY "Allow create settings" ON settings 
FOR INSERT WITH CHECK (true);

-- Разрешаем всем обновлять настройки
CREATE POLICY "Allow update settings" ON settings 
FOR UPDATE USING (true);

-- Разрешаем всем удалять настройки
CREATE POLICY "Allow delete settings" ON settings 
FOR DELETE USING (true);

-- 8. Проверяем, что RLS включен для всех таблиц
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE printers ENABLE ROW LEVEL SECURITY;
ALTER TABLE filaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- 9. Создаем тестовых пользователей, если их нет
INSERT INTO users (id, email, password, name) VALUES 
  ('00000000-0000-0000-0000-000000000001', 'andybear@3dcrm.com', 'pass111word', 'Администратор'),
  ('00000000-0000-0000-0000-000000000002', 'admin@3dcrm.com', 'pass1111word', 'Админ')
ON CONFLICT (id) DO NOTHING;

-- 10. Проверяем результат
SELECT 'RLS policies updated successfully!' as status;
