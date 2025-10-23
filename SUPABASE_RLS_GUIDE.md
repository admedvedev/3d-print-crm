# 🔒 Настройка RLS (Row Level Security) в Supabase

## 📋 Пошаговая инструкция

### 1. Открытие SQL Editor

1. **Войдите в ваш проект Supabase**
2. **В левом меню найдите "SQL Editor"** (иконка с `</>`)
3. **Нажмите "New query"**

### 2. Создание политик безопасности

Скопируйте и выполните этот код **по частям** (не весь сразу):

#### Шаг 1: Включение RLS для всех таблиц

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

#### Шаг 2: Политики для таблицы users

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

#### Шаг 3: Политики для таблицы printers

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

#### Шаг 4: Политики для таблицы filaments

```sql
-- Политики для пластиков
CREATE POLICY "Users can view own filaments" ON filaments 
FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own filaments" ON filaments 
FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own filaments" ON filaments 
FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own filaments" ON filaments 
FOR DELETE USING (auth.uid()::text = user_id::text);
```

**Нажмите "Run"** ✅

#### Шаг 5: Политики для таблицы clients

```sql
-- Политики для клиентов
CREATE POLICY "Users can view own clients" ON clients 
FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own clients" ON clients 
FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own clients" ON clients 
FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own clients" ON clients 
FOR DELETE USING (auth.uid()::text = user_id::text);
```

**Нажмите "Run"** ✅

#### Шаг 6: Политики для таблицы orders

```sql
-- Политики для заказов
CREATE POLICY "Users can view own orders" ON orders 
FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own orders" ON orders 
FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own orders" ON orders 
FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own orders" ON orders 
FOR DELETE USING (auth.uid()::text = user_id::text);
```

**Нажмите "Run"** ✅

#### Шаг 7: Политики для таблицы settings

```sql
-- Политики для настроек
CREATE POLICY "Users can view own settings" ON settings 
FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own settings" ON settings 
FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own settings" ON settings 
FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own settings" ON settings 
FOR DELETE USING (auth.uid()::text = user_id::text);
```

**Нажмите "Run"** ✅

### 3. Проверка политик

После выполнения всех шагов:

1. **Перейдите в "Authentication" → "Policies"**
2. **Вы должны увидеть все созданные политики**

### 4. Альтернативный способ через UI

Если SQL не работает, можно создать политики через интерфейс:

1. **Перейдите в "Authentication" → "Policies"**
2. **Выберите таблицу** (например, `printers`)
3. **Нажмите "New Policy"**
4. **Выберите "For full customization"**
5. **Заполните:**
   - **Name**: `Users can view own printers`
   - **Operation**: `SELECT`
   - **Target roles**: `authenticated`
   - **USING expression**: `auth.uid()::text = user_id::text`
6. **Нажмите "Save"**

### 5. Проверка работы

После настройки политик:

1. **Откройте ваш сайт**
2. **Войдите в систему**
3. **Попробуйте добавить принтер или клиента**
4. **Данные должны сохраняться в Supabase**

## ⚠️ Важные моменты

- **Выполняйте SQL по частям** - не весь код сразу
- **После каждого блока нажимайте "Run"**
- **Проверяйте, что нет ошибок** в консоли
- **Политики применяются сразу** после создания

## 🎯 Что делают политики

- **`SELECT`** - пользователь может только читать свои данные
- **`INSERT`** - пользователь может создавать только свои записи
- **`UPDATE`** - пользователь может изменять только свои записи
- **`DELETE`** - пользователь может удалять только свои записи
- **`auth.uid()::text = user_id::text`** - проверяет, что запись принадлежит текущему пользователю

## 🔧 Если что-то не работает

1. **Проверьте, что RLS включен** для всех таблиц
2. **Убедитесь, что политики созданы** для всех операций
3. **Проверьте синтаксис** - не должно быть ошибок
4. **Попробуйте создать политики через UI** вместо SQL
