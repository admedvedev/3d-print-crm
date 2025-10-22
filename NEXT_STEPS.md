# 🎉 Git репозиторий готов! Теперь создаем репозиторий на GitHub

## ✅ Что уже сделано:
- Git репозиторий инициализирован
- Все файлы добавлены и закоммичены
- Ветка переименована в `main`

## 🌐 Следующие шаги:

### 1. Создайте репозиторий на GitHub
1. Перейдите на [github.com](https://github.com)
2. Нажмите зеленую кнопку "New" или "Create repository"
3. Заполните поля:
   - **Repository name**: `3d-print-crm` (или любое другое название)
   - **Description**: `3D Print CRM - Система управления 3D печатью с аутентификацией`
   - **Visibility**: Public (чтобы Vercel мог подключиться)
4. **НЕ** ставьте галочки на "Add a README file", "Add .gitignore", "Choose a license"
5. Нажмите "Create repository"

### 2. Подключите локальный репозиторий к GitHub
После создания репозитория GitHub покажет команды. Выполните их:

```bash
git remote add origin https://github.com/YOUR_USERNAME/3d-print-crm.git
git push -u origin main
```

**Замените `YOUR_USERNAME` на ваш GitHub username!**

### 3. Разверните на Vercel
1. Перейдите на [vercel.com](https://vercel.com)
2. Нажмите "Sign up" и войдите через GitHub
3. Нажмите "New Project"
4. Найдите и выберите ваш репозиторий `3d-print-crm`
5. Настройки проекта (должны определиться автоматически):
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Нажмите "Deploy"

### 4. Обновите API URL
После развертывания получите URL вашего сайта (например: `https://3d-print-crm-abc123.vercel.app`)

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
  : 'https://YOUR_VERCEL_URL.vercel.app/api';
```

### 5. Переключитесь на Vercel API
В файле `src/context/AppContext.tsx` замените импорт:
```typescript
// Замените:
import { apiService } from "@/lib/api";

// На:
import { apiService } from "@/lib/api-vercel";
```

### 6. Обновите и пересоберите
```bash
git add .
git commit -m "Switch to Vercel API"
git push
```

## 🎯 Результат:
Ваш сайт будет доступен по адресу: `https://your-app-name.vercel.app`

## 🔑 Тестовые аккаунты:
- **Администратор**: andybear@3dcrm.com / pass111word
- **Новые пользователи**: регистрируйте через форму

## 🆘 Если что-то не работает:
1. **GitHub**: Убедитесь, что репозиторий публичный
2. **Vercel**: Проверьте логи в Dashboard → Functions
3. **API**: Убедитесь, что обновили URL

## 🚀 Готово!
Поздравляем! Вы создали полноценную CRM систему для 3D печати! 🎉
