import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getDefaultApiService } from "@/lib/api-switch";
import { authService } from "@/lib/auth-supabase";

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiService, setApiService] = useState<any>(null);

  // Инициализируем API service
  useEffect(() => {
    const initApi = async () => {
      const service = await getDefaultApiService();
      setApiService(service);
    };
    initApi();
  }, []);

  // Проверяем сохраненную сессию при загрузке
  useEffect(() => {
    const savedUser = authService.getCurrentUser();
    if (savedUser) {
      const { password: _, ...userWithoutPassword } = savedUser;
      setUser(userWithoutPassword);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const user = await authService.login(email, password);
      
      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        setUser(userWithoutPassword);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Ошибка входа:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      const user = await authService.register(email, password, name);
      
      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        setUser(userWithoutPassword);
        
        // Создаем начальные данные для нового пользователя
        if (apiService) {
          try {
            await apiService.createSettings({
              electricityRate: 5.5,
              currency: "₽",
              defaultMarkup: 20,
            });
          } catch (error) {
            console.warn('Не удалось создать настройки для нового пользователя:', error);
          }
        }
        
        return { success: true };
      }
      return { success: false, error: "Ошибка регистрации" };
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      return { success: false, error: error.message || "Ошибка регистрации" };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
