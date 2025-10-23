// Тест подключения к Supabase
import { supabase } from './supabase'

export async function testSupabaseConnection() {
  try {
    console.log('🔍 Тестируем подключение к Supabase...')
    
    // Проверяем переменные окружения (приоритет VITE_ для Vite проектов)
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    console.log('📋 Переменные окружения:')
    console.log('NEXT_PUBLIC_SUPABASE_URL:', import.meta.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Настроен' : '❌ Не настроен')
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Настроен' : '❌ Не настроен')
    console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL ? '✅ Настроен' : '❌ Не настроен')
    console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Настроен' : '❌ Не настроен')
    
    // Показываем все доступные переменные
    console.log('📋 Все переменные окружения:')
    Object.keys(import.meta.env).forEach(key => {
      if (key.includes('SUPABASE') || key.includes('POSTGRES')) {
        console.log(`${key}:`, import.meta.env[key] ? 'Set' : 'Not set')
      }
    })
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Переменные окружения не настроены. Нужны NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY')
    }
    
    // Проверяем подключение
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Ошибка подключения:', error)
      throw error
    }
    
    console.log('✅ Подключение к Supabase успешно!')
    return { success: true, data }
    
  } catch (error) {
    console.error('❌ Ошибка тестирования подключения:', error)
    return { success: false, error: error.message }
  }
}

// Автоматический тест при загрузке
if (typeof window !== 'undefined') {
  testSupabaseConnection()
}
