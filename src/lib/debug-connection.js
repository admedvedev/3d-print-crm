// Детальная диагностика подключения к Supabase
import { createClient } from '@supabase/supabase-js'

export async function debugSupabaseConnection() {
  console.log('🔍 ДЕТАЛЬНАЯ ДИАГНОСТИКА SUPABASE')
  console.log('=====================================')
  
  // 1. Проверяем все переменные окружения
  console.log('📋 ВСЕ ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ:')
  const allEnvVars = {}
  Object.keys(import.meta.env).forEach(key => {
    allEnvVars[key] = import.meta.env[key]
  })
  
  console.table(allEnvVars)
  
  // 2. Проверяем конкретные переменные Supabase (приоритет VITE_ для Vite проектов)
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  console.log('🔗 ПЕРЕМЕННЫЕ SUPABASE:')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl)
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'NOT SET')
  console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL)
  console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? `${import.meta.env.VITE_SUPABASE_ANON_KEY.substring(0, 20)}...` : 'NOT SET')
  
  // 3. Проверяем, что переменные валидны
  if (!supabaseUrl || supabaseUrl === 'https://your-project.supabase.co') {
    console.error('❌ SUPABASE URL НЕ НАСТРОЕН!')
    return { success: false, error: 'Supabase URL не настроен' }
  }
  
  if (!supabaseKey || supabaseKey === 'your-anon-key') {
    console.error('❌ SUPABASE KEY НЕ НАСТРОЕН!')
    return { success: false, error: 'Supabase Key не настроен' }
  }
  
  // 4. Создаем клиент Supabase
  console.log('🔧 СОЗДАНИЕ КЛИЕНТА SUPABASE...')
  let supabase
  try {
    supabase = createClient(supabaseUrl, supabaseKey)
    console.log('✅ Клиент Supabase создан успешно')
  } catch (error) {
    console.error('❌ ОШИБКА СОЗДАНИЯ КЛИЕНТА:', error)
    return { success: false, error: `Ошибка создания клиента: ${error.message}` }
  }
  
  // 5. Тестируем подключение
  console.log('🔌 ТЕСТИРОВАНИЕ ПОДКЛЮЧЕНИЯ...')
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ ОШИБКА ЗАПРОСА К БД:', error)
      console.error('Код ошибки:', error.code)
      console.error('Сообщение:', error.message)
      console.error('Детали:', error.details)
      console.error('Подсказка:', error.hint)
      return { success: false, error: `Ошибка запроса: ${error.message}` }
    }
    
    console.log('✅ ПОДКЛЮЧЕНИЕ К БД УСПЕШНО!')
    console.log('Данные:', data)
    return { success: true, data }
    
  } catch (error) {
    console.error('❌ ОШИБКА ПОДКЛЮЧЕНИЯ:', error)
    return { success: false, error: `Ошибка подключения: ${error.message}` }
  }
}

// Автоматический запуск при загрузке
if (typeof window !== 'undefined') {
  debugSupabaseConnection()
}
