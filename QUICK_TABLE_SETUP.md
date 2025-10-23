# ⚡ Быстрое создание таблиц в базе данных

## 🚀 За 2 минуты

### 1. Создайте таблицы через API

Откройте в браузере и нажмите **POST**:
```
https://3d-print-crm.vercel.app/api/create-tables
```

**Или через curl:**
```bash
curl -X POST https://3d-print-crm.vercel.app/api/create-tables
```

### 2. Проверьте результат

Должно показать:
```json
{
  "message": "Database tables created successfully",
  "tables": ["User", "Printer", "Filament", "Client", "Order", "Settings"],
  "initialized": true
}
```

### 3. Проверьте статус базы данных

Откройте:
```
https://3d-print-crm.vercel.app/api/health
```

Должно показать:
```json
{
  "prisma": {
    "status": "connected"
  }
}
```

### 4. Протестируйте сайт

1. **Откройте ваш сайт**
2. **Войдите:** `andybear@3dcrm.com` / `pass111word`
3. **Добавьте принтер или клиента**
4. **Обновите страницу** - данные сохранятся!

## ✅ Готово!

Теперь у вас полноценная база данных с таблицами! 🎉

## ❌ Если не работает

1. **Проверьте логи** в Vercel Dashboard → Functions
2. **Убедитесь** что база данных создана в Storage
3. **Проверьте** что `POSTGRES_PRISMA_URL` установлена в Environment Variables
