# 🔧 Исправление ошибки Vercel

## ❌ Проблема:
```
error during build:
[vite:esbuild] parsing /vercel/path0/tsconfig.app.json failed: Error: ENOENT: no such file or directory
Error: Command "npm run vercel-build" exited with 1
```

## ✅ Решение:

### 1. Обновите конфигурацию Vercel
В настройках проекта Vercel измените:

**Build Command:** `npm run build` (вместо `npm run vercel-build`)
**Output Directory:** `dist`

### 2. Альтернативный способ - замените vercel.json
Если проблема продолжается, замените содержимое `vercel.json` на:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### 3. Проверьте настройки проекта
В Vercel Dashboard → Settings → General:
- **Framework Preset**: Vite
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 4. Пересоберите проект
После изменения настроек:
1. Перейдите в Vercel Dashboard
2. Найдите ваш проект
3. Нажмите "Redeploy" или "Deploy"

## 🎯 Если ничего не помогает:

### Вариант 1: Удалите и пересоздайте проект
1. Удалите проект в Vercel Dashboard
2. Создайте новый проект из того же репозитория
3. Используйте настройки выше

### Вариант 2: Используйте Railway
1. Перейдите на [railway.app](https://railway.app)
2. Подключите GitHub репозиторий
3. Railway автоматически определит Vite проект

### Вариант 3: Используйте Render
1. Перейдите на [render.com](https://render.com)
2. Создайте Web Service
3. Подключите GitHub репозиторий
4. Настройте:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`

## ✅ Проверка:
После исправления ваш сайт должен быть доступен по адресу:
`https://your-app-name.vercel.app`

## 🆘 Если проблема продолжается:
1. Проверьте логи в Vercel Dashboard → Functions
2. Убедитесь, что все файлы загружены в репозиторий
3. Попробуйте очистить кэш Vercel
