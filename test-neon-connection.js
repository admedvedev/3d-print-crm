#!/usr/bin/env node

// Скрипт для проверки подключения к Neon Postgres
const { sql } = require('@vercel/postgres');

async function testConnection() {
  console.log('🔍 Проверка подключения к Neon Postgres...\n');
  
  try {
    // Проверяем подключение
    const result = await sql`SELECT NOW() as current_time, version() as postgres_version`;
    
    console.log('✅ Подключение успешно!');
    console.log(`📅 Текущее время: ${result.rows[0].current_time}`);
    console.log(`🐘 Версия PostgreSQL: ${result.rows[0].postgres_version}\n`);
    
    // Проверяем существование таблиц
    console.log('🔍 Проверка таблиц...');
    
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;
    
    if (tables.rows.length > 0) {
      console.log('✅ Найденные таблицы:');
      tables.rows.forEach(row => {
        console.log(`  - ${row.table_name}`);
      });
    } else {
      console.log('⚠️  Таблицы не найдены. Запустите инициализацию базы данных.');
    }
    
    console.log('\n🎉 Проверка завершена успешно!');
    
  } catch (error) {
    console.error('❌ Ошибка подключения к базе данных:');
    console.error(error.message);
    
    console.log('\n🔧 Возможные решения:');
    console.log('1. Проверьте переменные окружения POSTGRES_URL');
    console.log('2. Убедитесь, что база данных Neon доступна');
    console.log('3. Проверьте строку подключения');
    console.log('4. Убедитесь, что SSL включен (sslmode=require)');
    
    process.exit(1);
  }
}

// Запускаем проверку
testConnection();
