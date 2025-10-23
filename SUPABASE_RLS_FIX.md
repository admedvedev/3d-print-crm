# 🔒 Исправление политик RLS в Supabase

## 🚨 Проблема

Ошибка `new row violates row-level security policy for table "users"` означает, что политики RLS блокируют создание пользователей.

## 🔧 Решение

### 1. Откройте Supabase Dashboard

1. **Перейдите в ваш проект Supabase**
2. **Откройте SQL Editor** (иконка `</>`)
3. **Нажмите "New query"**

### 2. Исправьте политики для таблицы users

Выполните этот SQL код:

```sql
-- Удаляем старые политики
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;

-- Создаем новые политики
-- Разрешаем всем создавать пользователей (для регистрации)
CREATE POLICY "Allow user registration" ON users 
FOR INSERT WITH CHECK (true);

-- Разрешаем всем читать пользователей (для входа)
CREATE POLICY "Allow user login" ON users 
FOR SELECT USING (true);

-- Разрешаем пользователям обновлять только свои данные
CREATE POLICY "Users can update own data" ON users 
FOR UPDATE USING (auth.uid()::text = id::text);
```

**Нажмите "Run"** ✅

### 3. Проверьте другие таблицы

Убедитесь, что политики для других таблиц правильные:

```sql
-- Политики для принтеров
DROP POLICY IF EXISTS "Users can view own printers" ON printers;
DROP POLICY IF EXISTS "Users can insert own printers" ON printers;
DROP POLICY IF EXISTS "Users can update own printers" ON printers;
DROP POLICY IF EXISTS "Users can delete own printers" ON printers;

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

### 4. Альтернативное решение (если не работает)

Если политики все еще не работают, временно отключите RLS для таблицы users:

```sql
-- ВНИМАНИЕ: Это менее безопасно, но позволит работать
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

**Нажмите "Run"** ✅

### 5. Проверьте тестовых пользователей

Убедитесь, что тестовые пользователи существуют:

```sql
-- Проверяем существующих пользователей
SELECT * FROM users;

-- Если пользователей нет, создаем их
INSERT INTO users (id, email, password, name) VALUES 
  ('00000000-0000-0000-0000-000000000001', 'andybear@3dcrm.com', 'pass111word', 'Администратор'),
  ('00000000-0000-0000-0000-000000000002', 'admin@3dcrm.com', 'pass1111word', 'Админ')
ON CONFLICT (id) DO NOTHING;
```

**Нажмите "Run"** ✅

## ✅ Проверка

После выполнения всех шагов:

1. **Попробуйте зарегистрировать нового пользователя**
2. **Попробуйте войти с тестовыми аккаунтами:**
   - `andybear@3dcrm.com / pass111word`
   - `admin@3dcrm.com / pass1111word`
3. **Попробуйте добавить принтер или клиента**

## 🔍 Если все еще не работает

1. **Проверьте, что RLS включен для всех таблиц:**
```sql
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

2. **Проверьте политики:**
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';
```

3. **Если ничего не помогает, временно отключите RLS:**
```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE printers DISABLE ROW LEVEL SECURITY;
ALTER TABLE filaments DISABLE ROW LEVEL SECURITY;
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE settings DISABLE ROW LEVEL SECURITY;
```

## ⚠️ Важно

- **Выполняйте SQL по частям** - не весь код сразу
- **После каждого блока нажимайте "Run"**
- **Проверяйте, что нет ошибок** в консоли
- **После исправления можно включить RLS обратно** для безопасности
