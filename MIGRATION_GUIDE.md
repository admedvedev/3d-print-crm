# 🚀 Руководство по миграции на Vercel Postgres

## 📋 Пошаговая инструкция

### 1. Создание базы данных

#### Вариант A: Vercel Postgres (Рекомендуется для простоты)
1. **Перейдите в Vercel Dashboard:**
   - Откройте [vercel.com/dashboard](https://vercel.com/dashboard)
   - Выберите проект `3d-print-crm`

2. **Создайте Postgres базу данных:**
   - Перейдите в раздел **Storage**
   - Нажмите **Create Database** → **Postgres**
   - Назовите базу данных `3d-print-crm-db`
   - Выберите регион (рекомендуется ближайший к вашим пользователям)

3. **Дождитесь создания:**
   - Vercel автоматически добавит переменные окружения
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`

#### Вариант B: Neon Postgres (Рекомендуется для производительности)
1. **Создайте базу данных в Neon:**
   - Перейдите в [console.neon.tech](https://console.neon.tech)
   - Создайте новый проект
   - Получите Connection String

2. **Добавьте переменные окружения в Vercel:**
   - Перейдите в **Settings** → **Environment Variables**
   - Добавьте `POSTGRES_URL` со строкой подключения из Neon
   - Добавьте `POSTGRES_PRISMA_URL` с той же строкой
   - Добавьте `POSTGRES_URL_NON_POOLING` с той же строкой

3. **Проверьте подключение:**
   ```bash
   node test-neon-connection.js
   ```

### 2. Деплой изменений

```bash
# Все файлы уже добавлены в репозиторий
git push origin main
```

### 3. Инициализация базы данных

После деплоя инициализируйте базу данных:

```bash
# Используйте curl или Postman
curl -X POST https://ваш-домен.vercel.app/api/init-db
```

Или откройте в браузере и отправьте POST запрос:
```
https://ваш-домен.vercel.app/api/init-db
```

### 4. Миграция API endpoints

Запустите скрипт миграции:

```bash
node migrate-to-postgres.js
```

Этот скрипт:
- ✅ Создаст резервные копии старых файлов
- ✅ Заменит in-memory API на Postgres версии
- ✅ Сохранит старые файлы с расширением `.backup`

### 5. Проверка работы

1. **Проверьте инициализацию базы данных:**
   ```bash
   curl https://ваш-домен.vercel.app/api/users
   ```

2. **Проверьте вход в систему:**
   - Email: `andybear@3dcrm.com`
   - Password: `pass111word`

3. **Проверьте все функции:**
   - Создание принтеров
   - Создание пластиков
   - Создание клиентов
   - Создание заказов
   - Обновление данных

## 🔄 Откат изменений

Если что-то пошло не так, можете откатиться:

```bash
# Восстановите резервные копии
cd api
mv users.js.backup users.js
mv printers.js.backup printers.js
mv filaments.js.backup filaments.js
mv clients.js.backup clients.js
mv orders.js.backup orders.js
mv settings.js.backup settings.js
```

## 📊 Структура базы данных

### Таблица users
```sql
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Таблица printers
```sql
CREATE TABLE printers (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  power INTEGER NOT NULL,
  cost DECIMAL(10,2) NOT NULL,
  depreciation DECIMAL(5,2) NOT NULL,
  total_hours INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Таблица filaments
```sql
CREATE TABLE filaments (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  weight DECIMAL(10,3) NOT NULL,
  cost DECIMAL(10,2) NOT NULL,
  color VARCHAR(7) NOT NULL,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Таблица clients
```sql
CREATE TABLE clients (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Таблица orders
```sql
CREATE TABLE orders (
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
);
```

### Таблица settings
```sql
CREATE TABLE settings (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  electricity_rate DECIMAL(5,2) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  default_markup DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🚨 Важные замечания

1. **Безопасность паролей:** В продакшене обязательно хешируйте пароли
2. **Валидация данных:** Всегда проверяйте входные данные
3. **Обработка ошибок:** Добавьте логирование ошибок
4. **Индексы:** Для больших таблиц добавьте индексы
5. **Backup:** Настройте автоматическое резервное копирование

## 📈 Мониторинг

В Vercel Dashboard отслеживайте:
- Использование базы данных
- Производительность запросов
- Ошибки подключения
- Использование хранилища

## 🆘 Поддержка

Если возникли проблемы:
1. Проверьте логи в Vercel Dashboard
2. Убедитесь, что база данных создана
3. Проверьте переменные окружения
4. Проверьте инициализацию базы данных
