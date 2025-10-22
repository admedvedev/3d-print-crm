#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Оптимизация для Vercel Hobby плана (лимит 12 функций)...\n');

const apiDir = path.join(__dirname, 'api');

// Список файлов для удаления (оставляем только необходимые)
const filesToKeep = [
  'database.js',        // Универсальный API endpoint
  'init-db.js',         // Инициализация базы данных
  'users.js',           // Оставляем для совместимости
  'printers.js',        // Оставляем для совместимости
  'filaments.js',       // Оставляем для совместимости
  'clients.js',         // Оставляем для совместимости
  'orders.js',          // Оставляем для совместимости
  'settings.js'         // Оставляем для совместимости
];

// Файлы для удаления
const filesToRemove = [
  'users-postgres.js',
  'printers-postgres.js',
  'filaments-postgres.js',
  'clients-postgres.js',
  'orders-postgres.js',
  'settings-postgres.js'
];

console.log('📦 Создание резервных копий...');
filesToRemove.forEach(file => {
  const filePath = path.join(apiDir, file);
  if (fs.existsSync(filePath)) {
    const backupPath = path.join(apiDir, `${file}.backup`);
    fs.copyFileSync(filePath, backupPath);
    console.log(`  ✅ ${file} → ${file}.backup`);
  }
});

console.log('\n🗑️  Удаление лишних файлов...');
filesToRemove.forEach(file => {
  const filePath = path.join(apiDir, file);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`  ✅ Удален ${file}`);
  }
});

console.log('\n📊 Подсчет оставшихся API endpoints...');
const remainingFiles = fs.readdirSync(apiDir)
  .filter(file => file.endsWith('.js'))
  .filter(file => !file.endsWith('.backup'));

console.log(`  📁 Осталось ${remainingFiles.length} API endpoints:`);
remainingFiles.forEach(file => {
  console.log(`    - ${file}`);
});

if (remainingFiles.length <= 12) {
  console.log('\n✅ Отлично! Укладываемся в лимит Vercel Hobby плана (12 функций)');
} else {
  console.log('\n⚠️  Внимание! Все еще превышаем лимит. Нужно удалить еще файлы.');
}

console.log('\n🔄 Обновление api-switch.ts для использования универсального API...');

// Обновляем api-switch.ts
const apiSwitchPath = path.join(__dirname, 'src', 'lib', 'api-switch.ts');
let apiSwitchContent = fs.readFileSync(apiSwitchPath, 'utf8');

// Заменяем импорт на универсальный API
apiSwitchContent = apiSwitchContent.replace(
  "const { apiService } = await import('./api-vercel');",
  "const { apiService } = await import('./api-unified');"
);

fs.writeFileSync(apiSwitchPath, apiSwitchContent);
console.log('  ✅ api-switch.ts обновлен');

console.log('\n🎉 Оптимизация завершена!');
console.log('\n📋 Следующие шаги:');
console.log('1. Деплойте изменения: git push origin main');
console.log('2. Инициализируйте базу данных: POST /api/init-db');
console.log('3. Протестируйте приложение');
console.log('\n💾 Резервные копии сохранены с расширением .backup');
