-- Полное исправление политик RLS с очисткой старых политик
-- Выполните этот код в Supabase SQL Editor

-- 1. Удаляем ВСЕ политики для всех таблиц
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Удаляем все политики для всех таблиц
    FOR r IN (
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;

-- 2. Отключаем RLS для всех таблиц
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE printers DISABLE ROW LEVEL SECURITY;
ALTER TABLE filaments DISABLE ROW LEVEL SECURITY;
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE settings DISABLE ROW LEVEL SECURITY;

-- 3. Создаем тестовых пользователей, если их нет
INSERT INTO users (id, email, password, name) VALUES 
  ('00000000-0000-0000-0000-000000000001', 'andybear@3dcrm.com', 'pass111word', 'Администратор'),
  ('00000000-0000-0000-0000-000000000002', 'admin@3dcrm.com', 'pass1111word', 'Админ')
ON CONFLICT (id) DO NOTHING;

-- 4. Проверяем результат
SELECT 'All RLS policies removed and RLS disabled!' as status;

-- 5. Показываем текущее состояние
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
