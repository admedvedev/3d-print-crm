// Automatic API switching based on environment
const isProduction = process.env.NODE_ENV === 'production';
const isVercel = process.env.VERCEL === '1';

// Choose API implementation based on environment
export async function getApiService() {
  // Временно используем JSON Server для всех сред
  // Позже можно переключиться на Prisma когда настроите базу данных
  const { apiService } = await import('./api');
  return apiService;
}

// For backward compatibility, create a default instance
let defaultApiService: any = null;

export async function getDefaultApiService() {
  if (!defaultApiService) {
    defaultApiService = await getApiService();
  }
  return defaultApiService;
}
