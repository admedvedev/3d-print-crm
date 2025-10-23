# 🗄️ Подключение базы данных в Vercel

## 📋 Пошаговая инструкция

### 1. Создание Vercel Postgres базы данных

#### Через Vercel Dashboard (Рекомендуется):

1. **Перейдите на [vercel.com](https://vercel.com)**
2. **Войдите в свой аккаунт**
3. **Выберите проект `3d-print-crm`**
4. **Перейдите в раздел "Storage"** (в боковом меню)
5. **Нажмите "Create Database"**
6. **Выберите "Postgres"**
7. **Заполните форму:**
   - **Name:** `3d-print-crm-db`
   - **Plan:** Hobby (бесплатный)
   - **Region:** `iad1` (US East) - рекомендуется
8. **Нажмите "Create"**

#### Через Vercel CLI (Альтернатива):

```bash
# Установите Vercel CLI если не установлен
npm i -g vercel

# Войдите в аккаунт
vercel login

# Создайте базу данных
vercel postgres create 3d-print-crm-db
```

### 2. Получение переменных окружения

После создания базы данных Vercel автоматически добавит переменные:

- `POSTGRES_URL` - основная строка подключения
- `POSTGRES_PRISMA_URL` - строка для Prisma (с connection pooling)
- `POSTGRES_URL_NON_POOLING` - строка без pooling

### 3. Проверка переменных окружения

1. **В Vercel Dashboard перейдите в Settings → Environment Variables**
2. **Убедитесь, что переменные добавлены:**
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL`
   - `POSTGRES_URL_NON_POOLING`

### 4. Развертывание проекта

1. **Закоммитьте изменения:**
```bash
git add .
git commit -m "Setup database connection"
git push origin main
```

2. **Vercel автоматически пересоберет проект**

3. **Prisma сгенерирует клиент и подключится к базе данных**

### 5. Инициализация базы данных

После развертывания инициализируйте базу данных:

#### Через API endpoint:
```bash
curl -X POST https://your-app.vercel.app/api/init-db
```

#### Или через браузер:
Откройте: `https://your-app.vercel.app/api/init-db` (POST запрос)

### 6. Проверка работы

#### Health Check:
Откройте: `https://your-app.vercel.app/api/health`

Должен показать:
```json
{
  "status": "ok",
  "prisma": {
    "status": "connected",
    "databaseUrl": "set"
  }
}
```

#### Тестирование приложения:
1. **Откройте ваш сайт**
2. **Войдите с тестовым аккаунтом:**
   - Email: `andybear@3dcrm.com`
   - Password: `pass111word`
3. **Добавьте принтер, клиента или заказ**
4. **Обновите страницу - данные должны сохраниться!**

## 🔧 Альтернативные базы данных

### Neon (Рекомендуется для продакшена)

1. **Перейдите на [neon.tech](https://neon.tech)**
2. **Создайте аккаунт**
3. **Создайте проект**
4. **Скопируйте Connection String**
5. **Добавьте в Vercel Environment Variables:**
   - `POSTGRES_PRISMA_URL` = ваш connection string

### Supabase

1. **Перейдите на [supabase.com](https://supabase.com)**
2. **Создайте проект**
3. **Перейдите в Settings → Database**
4. **Скопируйте Connection String**
5. **Добавьте в Vercel Environment Variables**

### PlanetScale

1. **Перейдите на [planetscale.com](https://planetscale.com)**
2. **Создайте базу данных**
3. **Получите Connection String**
4. **Добавьте в Vercel Environment Variables**

## 🚨 Решение проблем

### Ошибка "Database not found"
- Проверьте, что база данных создана в Vercel Dashboard
- Убедитесь, что переменные окружения добавлены

### Ошибка "Connection refused"
- Проверьте правильность Connection String
- Убедитесь, что база данных активна

### Ошибка "Prisma client not generated"
- Проверьте, что `POSTGRES_PRISMA_URL` установлена
- Пересоберите проект в Vercel

### Данные не сохраняются
- Проверьте логи Vercel Functions
- Убедитесь, что база данных доступна
- Проверьте health check endpoint

## 📊 Мониторинг

### Vercel Dashboard:
- **Functions** → просмотр логов
- **Storage** → управление базой данных
- **Analytics** → статистика использования

### Prisma Studio (локально):
```bash
npm run db:studio
```

## 💰 Стоимость

- **Vercel Postgres Hobby:** Бесплатно (500MB, 1 база данных)
- **Neon Free:** Бесплатно (3GB, 1 база данных)
- **Supabase Free:** Бесплатно (500MB, 1 база данных)

## 🎯 Рекомендации

1. **Для тестирования:** Vercel Postgres Hobby
2. **Для продакшена:** Neon или Supabase
3. **Для разработки:** Локальный JSON Server

## ✅ Проверочный список

- [ ] База данных создана в Vercel
- [ ] Переменные окружения добавлены
- [ ] Проект пересобран
- [ ] Health check показывает "connected"
- [ ] Данные сохраняются после обновления страницы
- [ ] Все CRUD операции работают
