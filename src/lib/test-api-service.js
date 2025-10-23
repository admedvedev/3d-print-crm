// Тест API Service
import { getApiService } from './api-switch'

export async function testApiService() {
  console.log('🧪 ТЕСТИРОВАНИЕ API SERVICE')
  console.log('============================')
  
  try {
    // Получаем API service
    console.log('📡 Получение API service...')
    const apiService = await getApiService()
    console.log('✅ API Service получен:', apiService.constructor.name)
    
    // Проверяем методы
    console.log('🔍 Проверка методов API service...')
    const methods = [
      'getUsers',
      'getPrinters', 
      'getFilaments',
      'getClients',
      'getOrders',
      'getSettings'
    ]
    
    methods.forEach(method => {
      if (typeof apiService[method] === 'function') {
        console.log(`✅ ${method}: доступен`)
      } else {
        console.log(`❌ ${method}: НЕ ДОСТУПЕН`)
      }
    })
    
    // Тестируем получение пользователей
    console.log('👥 Тестирование получения пользователей...')
    try {
      const users = await apiService.getUsers()
      console.log('✅ Пользователи получены:', users.length, 'записей')
      console.log('Данные пользователей:', users)
    } catch (error) {
      console.error('❌ Ошибка получения пользователей:', error)
    }
    
    return { success: true, apiService }
    
  } catch (error) {
    console.error('❌ ОШИБКА API SERVICE:', error)
    return { success: false, error: error.message }
  }
}

// Автоматический запуск
if (typeof window !== 'undefined') {
  setTimeout(() => {
    testApiService()
  }, 2000) // Запускаем через 2 секунды после загрузки
}
