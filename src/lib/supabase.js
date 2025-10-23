import { createClient } from '@supabase/supabase-js'

// Используем правильные переменные окружения
const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

// Диагностика переменных окружения
console.log('🔍 Supabase Configuration:')
console.log('URL:', supabaseUrl)
console.log('Key:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'Not set')
console.log('Environment:', import.meta.env.MODE)

// Показываем все доступные переменные для отладки
console.log('📋 Available environment variables:')
Object.keys(import.meta.env).forEach(key => {
  if (key.includes('SUPABASE') || key.includes('POSTGRES')) {
    console.log(`${key}:`, import.meta.env[key] ? 'Set' : 'Not set')
  }
})

// Проверяем, что переменные настроены правильно
if (supabaseUrl === 'https://your-project.supabase.co' || supabaseKey === 'your-anon-key') {
  console.warn('⚠️ Supabase не настроен! Используются значения по умолчанию.')
  console.warn('Настройте переменные окружения NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
