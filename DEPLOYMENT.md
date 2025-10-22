# 🚀 Развертывание на Vercel

## Подготовка к развертыванию

### 1. Создайте репозиторий на GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo-name.git
git push -u origin main
```

### 2. Настройте Vercel

1. Перейдите на [vercel.com](https://vercel.com)
2. Войдите через GitHub
3. Нажмите "New Project"
4. Выберите ваш репозиторий
5. Настройки:
   - **Framework Preset**: Vite
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3. Обновите API URL

После развертывания обновите URL в `src/lib/api-vercel.ts`:

```typescript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-app-name.vercel.app/api'  // Замените на ваш URL
  : 'http://localhost:3000/api';
```

### 4. Переключитесь на Vercel API

В `src/context/AppContext.tsx` замените импорт:

```typescript
// Замените эту строку:
import { apiService } from "@/lib/api";

// На эту:
import { apiService } from "@/lib/api-vercel";
```

## Альтернативные варианты

### Railway (Рекомендуется для полной функциональности)

1. Перейдите на [railway.app](https://railway.app)
2. Войдите через GitHub
3. Создайте новый проект из репозитория
4. Добавьте PostgreSQL базу данных
5. Настройте переменные окружения

### Render

1. Перейдите на [render.com](https://render.com)
2. Создайте новый Web Service
3. Подключите GitHub репозиторий
4. Настройте:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`

### Netlify (только фронтенд)

1. Перейдите на [netlify.com](https://netlify.com)
2. Подключите GitHub репозиторий
3. Настройте:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`

## Переменные окружения

Создайте файл `.env.local` для локальной разработки:

```env
VITE_API_URL=http://localhost:3000/api
```

И настройте в Vercel:
- `VITE_API_URL=https://your-app-name.vercel.app/api`

## Проблемы и решения

### CORS ошибки
- Убедитесь, что API routes настроены правильно
- Проверьте заголовки CORS в `api/db.js`

### База данных
- Vercel: используйте встроенную память (данные сбрасываются при перезапуске)
- Railway/Render: подключите PostgreSQL для постоянного хранения

### Сборка
- Убедитесь, что все зависимости установлены
- Проверьте, что `npm run build` работает локально

## Мониторинг

После развертывания:
1. Проверьте логи в Vercel Dashboard
2. Тестируйте все функции
3. Настройте мониторинг ошибок (Sentry, LogRocket)

## Обновления

Для обновления сайта:
```bash
git add .
git commit -m "Update"
git push origin main
```

Vercel автоматически пересоберет и развернет обновления.
