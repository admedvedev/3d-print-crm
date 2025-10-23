// Automatic API switching based on environment
const isProduction = process.env.NODE_ENV === 'production';
const isVercel = process.env.VERCEL === '1';

// Choose API implementation based on environment
export async function getApiService() {
  if (isProduction || isVercel) {
    // Use persistent Vercel API for production
    const { apiService } = await import('./api-persistent');
    return apiService;
  } else {
    // Use local JSON Server for development
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
