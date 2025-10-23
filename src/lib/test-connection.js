// Тест подключения к Supabase
import { supabase } from './supabase'

export async function testSupabaseConnection() {
  try {
    console.log('🔍 Тестируем подключение к Supabase...')
    
    // Проверяем переменные окружения
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    console.log('📋 Переменные окружения:')
    console.log('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Настроен' : '❌ Не настроен')
    console.log('VITE_SUPABASE_ANON_KEY:', supabaseKey ? '✅ Настроен' : '❌ Не настроен')
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Переменные окружения не настроены')
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
