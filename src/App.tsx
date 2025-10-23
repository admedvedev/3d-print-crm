import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { AppProvider } from "@/context/AppContext";
import { PageProvider } from "@/context/PageContext";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AuthPage } from "@/components/auth/AuthPage";
import { testSupabaseConnection } from "@/lib/test-connection";
import { debugSupabaseConnection } from "@/lib/debug-connection";
import { testApiService } from "@/lib/test-api-service";
import { testEnvironmentVariables } from "@/lib/test-env-vars";
import Dashboard from "./pages/Dashboard";
import Calculator from "./pages/Calculator";
import Orders from "./pages/Orders";
import Printers from "./pages/Printers";
import Filaments from "./pages/Filaments";
import Clients from "./pages/Clients";
import Settings from "./pages/Settings";
import Diagnostics from "./pages/Diagnostics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route path="*" element={
        <ProtectedRoute>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/calculator" element={<Calculator />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/printers" element={<Printers />} />
              <Route path="/filaments" element={<Filaments />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/diagnostics" element={<Diagnostics />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </ProtectedRoute>
      } />
    </Routes>
  </BrowserRouter>
);

const App = () => {
  // Тестируем подключение к Supabase при загрузке
  React.useEffect(() => {
    console.log('🚀 Запуск полной диагностики...');
    
    // Сначала тестируем переменные окружения
    testEnvironmentVariables();
    
    // Затем тестируем Supabase
    debugSupabaseConnection();
    
    // Тестируем API service через 3 секунды
    setTimeout(() => {
      testApiService();
    }, 3000);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppProvider>
          <PageProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <AppRoutes />
            </TooltipProvider>
          </PageProvider>
        </AppProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;