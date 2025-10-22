# 🚀 Развертывание на Vercel - Пошаговая инструкция

## 📋 Что уже готово:
✅ Проект собран и готов к развертыванию  
✅ API routes настроены для Vercel  
✅ Конфигурация vercel.json создана  
✅ Все файлы подготовлены  

## 🌐 Вариант 1: Через веб-интерфейс Vercel (Рекомендуется)

### Шаг 1: Создайте репозиторий на GitHub
1. Перейдите на [github.com](https://github.com)
2. Нажмите "New repository"
3. Название: `3d-print-crm` (или любое другое)
4. Сделайте репозиторий публичным
5. Нажмите "Create repository"

### Шаг 2: Загрузите файлы на GitHub
1. Скачайте и установите [GitHub Desktop](https://desktop.github.com/) или используйте веб-интерфейс
2. Загрузите все файлы проекта в репозиторий
3. Сделайте первый commit с сообщением "Initial commit"

### Шаг 3: Разверните на Vercel
1. Перейдите на [vercel.com](https://vercel.com)
2. Нажмите "Sign up" и войдите через GitHub
3. Нажмите "New Project"
4. Выберите ваш репозиторий `3d-print-crm`
5. Настройки проекта:
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Нажмите "Deploy"

### Шаг 4: Обновите API URL
После развертывания получите URL вашего сайта (например: `https://3d-print-crm.vercel.app`)

В файле `src/lib/api-vercel.ts` замените:
```typescript
const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:3000/api'
  : '/api';
```

На:
```typescript
const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:3000/api'
  : 'https://your-app-name.vercel.app/api';
```

## 🌐 Вариант 2: Через Vercel CLI

### Если у вас установлен Git:
```bash
# Инициализация репозитория
git init
git add .
git commit -m "Initial commit: 3D Print CRM"

# Создайте репозиторий на GitHub и выполните:
git remote add origin https://github.com/yourusername/your-repo-name.git
git branch -M main
git push -u origin main

# Развертывание через Vercel CLI
vercel login
vercel --prod
```

## 🔧 Настройка после развертывания

### 1. Переключитесь на Vercel API
В файле `src/context/AppContext.tsx` замените импорт:
```typescript
// Замените:
import { apiService } from "@/lib/api";

// На:
import { apiService } from "@/lib/api-vercel";
```

### 2. Обновите и пересоберите
```bash
npm run build
git add .
git commit -m "Switch to Vercel API"
git push
```

## 🎯 Тестирование

После развертывания проверьте:
- ✅ Сайт открывается
- ✅ Форма входа работает
- ✅ Регистрация новых пользователей работает
- ✅ Все страницы загружаются
- ✅ Данные сохраняются

## 📊 Тестовые аккаунты

После развертывания будут доступны:
- **Администратор**: admin@example.com / admin123
- **Новые пользователи**: можете регистрировать через форму

## 🆘 Если что-то не работает

### Проблема: CORS ошибки
**Решение**: Проверьте, что API routes настроены правильно в `api/db.js`

### Проблема: Сайт не загружается
**Решение**: Проверьте логи в Vercel Dashboard → Functions

### Проблема: Данные не сохраняются
**Решение**: Это нормально для Vercel - данные сбрасываются при перезапуске. Для постоянного хранения используйте Railway или Render.

## 🚀 Готово!

Ваш сайт будет доступен по адресу: `https://your-app-name.vercel.app`

Поделитесь ссылкой с друзьями! 🎉
