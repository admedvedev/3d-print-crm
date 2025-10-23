// Тест переменных окружения
export function testEnvironmentVariables() {
  console.log('🌍 ТЕСТ ПЕРЕМЕННЫХ ОКРУЖЕНИЯ')
  console.log('==============================')
  
  // Проверяем import.meta.env
  console.log('📋 import.meta.env:')
  console.log('MODE:', import.meta.env.MODE)
  console.log('DEV:', import.meta.env.DEV)
  console.log('PROD:', import.meta.env.PROD)
  
  // Проверяем все переменные
  console.log('📋 ВСЕ ПЕРЕМЕННЫЕ:')
  const allVars = {}
  Object.keys(import.meta.env).forEach(key => {
    allVars[key] = import.meta.env[key]
  })
  console.table(allVars)
  
  // Проверяем конкретно Supabase переменные
  console.log('🔍 SUPABASE ПЕРЕМЕННЫЕ:')
  const supabaseVars = {}
  Object.keys(import.meta.env).forEach(key => {
    if (key.includes('SUPABASE') || key.includes('POSTGRES')) {
      supabaseVars[key] = import.meta.env[key]
    }
  })
  console.table(supabaseVars)
  
  // Проверяем, есть ли переменные с NEXT_PUBLIC_
  const nextPublicVars = {}
  Object.keys(import.meta.env).forEach(key => {
    if (key.startsWith('NEXT_PUBLIC_')) {
      nextPublicVars[key] = import.meta.env[key]
    }
  })
  console.log('📋 NEXT_PUBLIC_ ПЕРЕМЕННЫЕ:')
  console.table(nextPublicVars)
  
  // Проверяем, есть ли переменные с VITE_
  const viteVars = {}
  Object.keys(import.meta.env).forEach(key => {
    if (key.startsWith('VITE_')) {
      viteVars[key] = import.meta.env[key]
    }
  })
  console.log('📋 VITE_ ПЕРЕМЕННЫЕ:')
  console.table(viteVars)
  
  return {
    allVars,
    supabaseVars,
    nextPublicVars,
    viteVars
  }
}

// Автоматический запуск
if (typeof window !== 'undefined') {
  testEnvironmentVariables()
}
