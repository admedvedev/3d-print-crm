@echo off
echo 🚀 Подготовка проекта для развертывания на Vercel...

echo 📦 Инициализация Git репозитория...
git init
git add .
git commit -m "Initial commit: 3D Print CRM with authentication"

echo ✅ Проект готов к развертыванию!
echo.
echo 📋 Следующие шаги:
echo 1. Создайте репозиторий на GitHub
echo 2. Выполните команды:
echo    git remote add origin https://github.com/yourusername/your-repo-name.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 3. Перейдите на vercel.com и подключите репозиторий
echo.
pause
