// Simple API switching - always use JSON Server
export async function getApiService() {
  // Always use JSON Server for simplicity
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
