@echo off
echo 🚀 Подключение к GitHub репозиторию...

echo.
echo 📋 Сначала создайте репозиторий на GitHub:
echo 1. Перейдите на https://github.com
echo 2. Нажмите "New repository"
echo 3. Название: 3d-print-crm
echo 4. Сделайте публичным
echo 5. НЕ добавляйте README, .gitignore, license
echo 6. Нажмите "Create repository"
echo.

set /p GITHUB_USERNAME="Введите ваш GitHub username: "
set /p REPO_NAME="Введите название репозитория (по умолчанию: 3d-print-crm): "

if "%REPO_NAME%"=="" set REPO_NAME=3d-print-crm

echo.
echo 🔗 Подключаем к GitHub...
git remote add origin https://github.com/%GITHUB_USERNAME%/%REPO_NAME%.git

echo.
echo 📤 Загружаем код на GitHub...
git push -u origin main

echo.
echo ✅ Готово! Репозиторий создан и код загружен!
echo.
echo 🌐 Теперь разверните на Vercel:
echo 1. Перейдите на https://vercel.com
echo 2. Войдите через GitHub
echo 3. Выберите ваш репозиторий
echo 4. Нажмите "Deploy"
echo.
pause
