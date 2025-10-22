# 🚀 Настройка Neon Postgres для 3D Print CRM

## 📋 Пошаговая инструкция

### 1. Получение строки подключения из Neon

1. **Перейдите в Neon Console:**
   - Откройте [console.neon.tech](https://console.neon.tech)
   - Войдите в свой аккаунт
   - Выберите ваш проект

2. **Получите Connection String:**
   - Перейдите в раздел **Connection Details**
   - Скопируйте **Connection String**
   - Она выглядит примерно так: `postgresql://username:password@hostname/database?sslmode=require`

### 2. Добавление переменных окружения в Vercel

#### Способ 1: Через Vercel Dashboard (Рекомендуется)
1. Перейдите в [Vercel Dashboard](https://vercel.com/dashboard)
2. Выберите проект `3d-print-crm`
3. Перейдите в **Settings** → **Environment Variables**
4. Добавьте следующие переменные:

```
POSTGRES_URL = postgresql://username:password@hostname/database?sslmode=require
POSTGRES_PRISMA_URL = postgresql://username:password@hostname/database?sslmode=require
POSTGRES_URL_NON_POOLING = postgresql://username:password@hostname/database?sslmode=require
```

#### Способ 2: Через CLI
```bash
# Добавьте переменные окружения
npx vercel env add POSTGRES_URL
# Вставьте строку подключения из Neon

npx vercel env add POSTGRES_PRISMA_URL  
# Вставьте ту же строку подключения

npx vercel env add POSTGRES_URL_NON_POOLING
# Вставьте ту же строку подключения
```

### 3. Инициализация базы данных

После добавления переменных окружения:

1. **Деплой изменений:**
   ```bash
   git push origin main
   ```

2. **Инициализация базы данных:**
   ```bash
   # Используйте curl или Postman
   curl -X POST https://ваш-домен.vercel.app/api/init-db
   ```

   Или откройте в браузере и отправьте POST запрос:
   ```
   https://ваш-домен.vercel.app/api/init-db
   ```

### 4. Миграция на Postgres

Запустите скрипт миграции:

```bash
node migrate-to-postgres.js
```

### 5. Проверка работы

1. **Проверьте инициализацию:**
   ```bash
   curl https://ваш-домен.vercel.app/api/users
   ```

2. **Проверьте вход в систему:**
   - Email: `andybear@3dcrm.com`
   - Password: `pass111word`

## 🔧 Настройка Neon

### Создание таблиц в Neon

Если хотите создать таблицы вручную в Neon Console:

1. Перейдите в **SQL Editor** в Neon Console
2. Выполните SQL скрипт из `api/init-db.js`

### Настройка подключения

Убедитесь, что в Neon:
- ✅ **SSL включен** (sslmode=require)
- ✅ **Доступ из внешних источников** разрешен
- ✅ **База данных создана** и доступна

## 📊 Преимущества Neon

- 🚀 **Serverless** - автоматическое масштабирование
- ⚡ **Быстрый старт** - мгновенное создание базы данных
- 💰 **Экономичный** - платите только за использование
- 🔒 **Безопасный** - встроенная защита данных
- 🌍 **Глобальный** - доступ из любой точки мира

## 🚨 Важные замечания

1. **Безопасность:** Никогда не коммитьте строки подключения в код
2. **Переменные окружения:** Используйте только через Vercel Environment Variables
3. **SSL:** Всегда используйте SSL подключение (sslmode=require)
4. **Backup:** Neon автоматически создает резервные копии

## 🔍 Проверка подключения

После настройки проверьте:

1. **Переменные окружения:**
   ```bash
   npx vercel env ls
   ```

2. **Подключение к базе данных:**
   - Откройте `https://ваш-домен.vercel.app/api/init-db`
   - Должно вернуть успешный ответ

3. **API endpoints:**
   - `https://ваш-домен.vercel.app/api/users`
   - `https://ваш-домен.vercel.app/api/printers`
   - И т.д.

## 🆘 Устранение проблем

### Ошибка подключения
- Проверьте строку подключения
- Убедитесь, что SSL включен
- Проверьте, что база данных доступна

### Ошибка инициализации
- Проверьте права доступа к базе данных
- Убедитесь, что переменные окружения добавлены
- Проверьте логи в Vercel Dashboard

### Ошибка миграции
- Убедитесь, что база данных инициализирована
- Проверьте, что все API endpoints работают
- Проверьте логи в Vercel Dashboard
