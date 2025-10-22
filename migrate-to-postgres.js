#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔄 Миграция с in-memory на Postgres...\n');

// Список файлов для миграции
const filesToMigrate = [
  { old: 'users.js', new: 'users-postgres.js' },
  { old: 'printers.js', new: 'printers-postgres.js' },
  { old: 'filaments.js', new: 'filaments-postgres.js' },
  { old: 'clients.js', new: 'clients-postgres.js' },
  { old: 'orders.js', new: 'orders-postgres.js' },
  { old: 'settings.js', new: 'settings-postgres.js' }
];

const apiDir = path.join(__dirname, 'api');

// Создаем резервные копии старых файлов
console.log('📦 Создание резервных копий...');
filesToMigrate.forEach(({ old, new: newFile }) => {
  const oldPath = path.join(apiDir, old);
  const backupPath = path.join(apiDir, `${old}.backup`);
  
  if (fs.existsSync(oldPath)) {
    fs.copyFileSync(oldPath, backupPath);
    console.log(`  ✅ ${old} → ${old}.backup`);
  }
});

// Заменяем файлы
console.log('\n🔄 Замена API endpoints...');
filesToMigrate.forEach(({ old, new: newFile }) => {
  const oldPath = path.join(apiDir, old);
  const newPath = path.join(apiDir, newFile);
  
  if (fs.existsSync(newPath)) {
    // Удаляем старый файл
    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }
    
    // Переименовываем новый файл
    fs.renameSync(newPath, oldPath);
    console.log(`  ✅ ${newFile} → ${old}`);
  } else {
    console.log(`  ⚠️  ${newFile} не найден, пропускаем`);
  }
});

console.log('\n✅ Миграция завершена!');
console.log('\n📋 Следующие шаги:');
console.log('1. Создайте базу данных в Vercel Dashboard');
console.log('2. Инициализируйте базу данных: POST /api/init-db');
console.log('3. Протестируйте приложение');
console.log('\n💾 Резервные копии сохранены в папке api/ с расширением .backup');
