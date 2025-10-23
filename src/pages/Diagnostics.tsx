import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { testSupabaseConnection } from '@/lib/test-connection';
import { getApiService } from '@/lib/api-switch';

const Diagnostics = () => {
  const [diagnostics, setDiagnostics] = useState({
    environment: 'loading',
    supabaseConfig: 'loading',
    supabaseConnection: 'loading',
    apiService: 'loading'
  });

  const [isLoading, setIsLoading] = useState(true);

  const runDiagnostics = async () => {
    setIsLoading(true);
    const results = { ...diagnostics };

    // 1. Проверка окружения
    results.environment = {
      mode: import.meta.env.MODE,
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'Not set',
      supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Not set'
    };

    // 2. Проверка конфигурации Supabase
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    results.supabaseConfig = {
      url: supabaseUrl,
      key: supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'Not set',
      isConfigured: supabaseUrl && supabaseKey && 
                   supabaseUrl !== 'https://your-project.supabase.co' && 
                   supabaseKey !== 'your-anon-key'
    };

    // 3. Тест подключения к Supabase
    try {
      const connectionTest = await testSupabaseConnection();
      results.supabaseConnection = connectionTest;
    } catch (error) {
      results.supabaseConnection = { success: false, error: error.message };
    }

    // 4. Проверка API Service
    try {
      const apiService = await getApiService();
      results.apiService = {
        type: apiService.constructor.name,
        available: !!apiService
      };
    } catch (error) {
      results.apiService = { error: error.message };
    }

    setDiagnostics(results);
    setIsLoading(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusIcon = (status) => {
    if (status === 'loading') return <Loader2 className="h-4 w-4 animate-spin" />;
    if (status?.success === true || status?.isConfigured === true || status?.available === true) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    if (status?.success === false || status?.error) {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    return <AlertCircle className="h-4 w-4 text-yellow-500" />;
  };

  const getStatusBadge = (status) => {
    if (status === 'loading') return <Badge variant="secondary">Loading...</Badge>;
    if (status?.success === true || status?.isConfigured === true || status?.available === true) {
      return <Badge variant="default" className="bg-green-500">OK</Badge>;
    }
    if (status?.success === false || status?.error) {
      return <Badge variant="destructive">Error</Badge>;
    }
    return <Badge variant="outline">Unknown</Badge>;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">🔍 Диагностика системы</h1>
          <p className="text-muted-foreground">Проверка подключения к базе данных и конфигурации</p>
        </div>
        <Button onClick={runDiagnostics} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Обновить
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Окружение */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(diagnostics.environment)}
              Окружение
            </CardTitle>
            <CardDescription>Переменные окружения и режим работы</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Режим:</span>
              <Badge variant="outline">{diagnostics.environment?.mode || 'Unknown'}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Supabase URL:</span>
              {getStatusBadge(diagnostics.environment?.supabaseUrl)}
            </div>
            <div className="flex justify-between">
              <span>Supabase Key:</span>
              {getStatusBadge(diagnostics.environment?.supabaseKey)}
            </div>
          </CardContent>
        </Card>

        {/* Конфигурация Supabase */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(diagnostics.supabaseConfig)}
              Конфигурация Supabase
            </CardTitle>
            <CardDescription>Настройки подключения к базе данных</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>URL:</span>
              <span className="text-sm font-mono">{diagnostics.supabaseConfig?.url || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span>Key:</span>
              <span className="text-sm font-mono">{diagnostics.supabaseConfig?.key || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span>Настроен:</span>
              {getStatusBadge(diagnostics.supabaseConfig?.isConfigured)}
            </div>
          </CardContent>
        </Card>

        {/* Подключение к Supabase */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(diagnostics.supabaseConnection)}
              Подключение к Supabase
            </CardTitle>
            <CardDescription>Тест соединения с базой данных</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Статус:</span>
              {getStatusBadge(diagnostics.supabaseConnection?.success)}
            </div>
            {diagnostics.supabaseConnection?.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {diagnostics.supabaseConnection.error}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* API Service */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(diagnostics.apiService)}
              API Service
            </CardTitle>
            <CardDescription>Активный сервис для работы с данными</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Тип:</span>
              <Badge variant="outline">{diagnostics.apiService?.type || 'Unknown'}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Доступен:</span>
              {getStatusBadge(diagnostics.apiService?.available)}
            </div>
            {diagnostics.apiService?.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {diagnostics.apiService.error}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Рекомендации */}
      {!isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>💡 Рекомендации</CardTitle>
          </CardHeader>
          <CardContent>
            {!diagnostics.supabaseConfig?.isConfigured ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Supabase не настроен. Настройте переменные окружения VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY в Vercel.
                </AlertDescription>
              </Alert>
            ) : !diagnostics.supabaseConnection?.success ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Ошибка подключения к Supabase. Проверьте правильность URL и ключа.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Все системы работают корректно! База данных подключена и готова к использованию.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Diagnostics;
