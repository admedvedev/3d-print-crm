import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

// Диагностика переменных окружения
console.log('🔍 Supabase Configuration:')
console.log('URL:', supabaseUrl)
console.log('Key:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'Not set')
console.log('Environment:', import.meta.env.MODE)

// Проверяем, что переменные настроены правильно
if (supabaseUrl === 'https://your-project.supabase.co' || supabaseKey === 'your-anon-key') {
  console.warn('⚠️ Supabase не настроен! Используются значения по умолчанию.')
  console.warn('Настройте переменные окружения VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
