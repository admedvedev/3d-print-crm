# Настройка Vercel Postgres для 3D Print CRM

## 🚀 Быстрый старт

### 1. Создание базы данных в Vercel Dashboard
1. Перейдите в [Vercel Dashboard](https://vercel.com/dashboard)
2. Выберите ваш проект `3d-print-crm`
3. Перейдите в раздел **Storage**
4. Нажмите **Create Database** → **Postgres**
5. Назовите базу данных `3d-print-crm-db`
6. Выберите регион (рекомендуется ближайший к вашим пользователям)

### 2. Получение переменных окружения
После создания базы данных Vercel автоматически добавит переменные:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL` 
- `POSTGRES_URL_NON_POOLING`

### 3. Инициализация базы данных
После деплоя перейдите по адресу:
```
https://ваш-домен.vercel.app/api/init-db
```
И отправьте POST запрос для создания таблиц и начальных данных.

### 4. Переключение на Postgres API
После инициализации базы данных замените файлы API:

```bash
# Переименуйте старые файлы
mv api/users.js api/users-old.js
mv api/printers.js api/printers-old.js

# Переименуйте новые файлы
mv api/users-postgres.js api/users.js
mv api/printers-postgres.js api/printers.js
```

### 5. Создание остальных Postgres API endpoints
Аналогично создайте файлы:
- `api/filaments-postgres.js`
- `api/clients-postgres.js` 
- `api/orders-postgres.js`
- `api/settings-postgres.js`

## 📊 Структура базы данных

### Таблица users
- `id` - UUID пользователя
- `email` - Email (уникальный)
- `password` - Пароль (хешированный)
- `name` - Имя пользователя
- `created_at` - Дата создания

### Таблица printers
- `id` - UUID принтера
- `user_id` - ID пользователя
- `name` - Название принтера
- `power` - Мощность (Вт)
- `cost` - Стоимость
- `depreciation` - Амортизация (%)
- `total_hours` - Общее время работы

### Таблица filaments
- `id` - UUID пластика
- `user_id` - ID пользователя
- `name` - Название пластика
- `weight` - Вес (кг)
- `cost` - Стоимость
- `color` - Цвет (HEX)
- `in_stock` - В наличии

### Таблица clients
- `id` - UUID клиента
- `user_id` - ID пользователя
- `name` - Имя клиента
- `email` - Email клиента
- `phone` - Телефон

### Таблица orders
- `id` - UUID заказа
- `user_id` - ID пользователя
- `task_name` - Название задачи
- `client_id` - ID клиента
- `client_name` - Имя клиента
- `printer_id` - ID принтера
- `printer_name` - Название принтера
- `filament_id` - ID пластика
- `filament_name` - Название пластика
- `print_time_hours` - Время печати (часы)
- `print_time_minutes` - Время печати (минуты)
- `weight` - Вес (г)
- `markup` - Наценка (%)
- `status` - Статус заказа
- `cost` - Стоимость
- `date` - Дата заказа

### Таблица settings
- `id` - UUID настроек
- `user_id` - ID пользователя
- `electricity_rate` - Тариф на электроэнергию
- `currency` - Валюта
- `default_markup` - Наценка по умолчанию

## 🔧 Преимущества Postgres над in-memory

1. **Постоянное хранение** - данные не теряются при перезапуске
2. **Масштабируемость** - поддержка множественных пользователей
3. **ACID транзакции** - надежность данных
4. **Индексы** - быстрый поиск
5. **Backup** - автоматическое резервное копирование

## 🚨 Важные замечания

1. **Безопасность**: Никогда не храните пароли в открытом виде
2. **Валидация**: Всегда проверяйте входные данные
3. **Ошибки**: Обрабатывайте ошибки базы данных
4. **Индексы**: Добавьте индексы для часто используемых полей
5. **Лимиты**: Vercel Postgres имеет лимиты на бесплатном тарифе

## 📈 Мониторинг

В Vercel Dashboard вы можете отслеживать:
- Использование базы данных
- Производительность запросов
- Ошибки подключения
- Использование хранилища
