# Настройка PlanetScale для Vercel

## 1. Создание базы данных PlanetScale
1. Перейдите на https://planetscale.com
2. Создайте новый проект
3. Получите connection string

## 2. Установка зависимостей
```bash
npm install @planetscale/database
```

## 3. Создание клиента PlanetScale
Создайте файл `lib/planetscale.js`:

```javascript
import { connect } from '@planetscale/database'

const config = {
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD
}

export const conn = connect(config)
```

## 4. Настройка переменных окружения в Vercel
Добавьте в настройки проекта Vercel:
- `DATABASE_HOST`
- `DATABASE_USERNAME`
- `DATABASE_PASSWORD`
