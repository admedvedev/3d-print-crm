// API Switch - выбирает правильный API в зависимости от окружения
export async function getApiService() {
  // Проверяем, настроен ли Supabase (приоритет VITE_ для Vite проектов)
  const isSupabaseConfigured = () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    // Отладочная информация
    console.log('Supabase URL:', supabaseUrl);
    console.log('Supabase Key:', supabaseKey ? 'Set' : 'Not set');
    
    return supabaseUrl && supabaseKey && 
           supabaseUrl !== 'https://your-project.supabase.co' && 
           supabaseKey !== 'your-anon-key';
  };

  // Используем Supabase если настроен, иначе localStorage
  if (isSupabaseConfigured()) {
    console.log('Using Supabase API');
    const { apiService } = await import('./api-supabase');
    return apiService;
  } else {
    console.log('Using localStorage API');
    const { apiService } = await import('./api');
    return apiService;
  }
}

// For backward compatibility, create a default instance
let defaultApiService: any = null;

export async function getDefaultApiService() {
  if (!defaultApiService) {
    defaultApiService = await getApiService();
  }
  return defaultApiService;
}
