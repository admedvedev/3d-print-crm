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
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Ошибка загрузки пользователя:', error);
        localStorage.removeItem('user');
      }
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
    if (!apiService) return { success: false, error: "API не инициализирован" };
    try {
      setLoading(true);
      const users = await apiService.getUsers();
      
      // Проверяем, не существует ли уже пользователь с таким email
      if (users.find((u: any) => u.email?.toLowerCase() === email.toLowerCase())) {
        return { success: false, error: "Пользователь с таким email уже существует" };
      }

      const newUser = {
        id: crypto.randomUUID(),
        email,
        password,
        name,
        createdAt: new Date().toISOString(),
      };

      await apiService.createUser(newUser);
      
      // Создаем начальные данные для нового пользователя
      await Promise.all([
        apiService.createSettings({
          id: crypto.randomUUID(),
          userId: newUser.id,
          electricityRate: 5.5,
          currency: "₽",
          defaultMarkup: 20,
        }),
        apiService.createPrinter({
          id: crypto.randomUUID(),
          userId: newUser.id,
          name: "Prusa i3 MK3S",
          power: 220,
          cost: 25000,
          depreciation: 10,
          totalHours: 150,
        }),
        apiService.createFilament({
          id: crypto.randomUUID(),
          userId: newUser.id,
          name: "PLA Базовый",
          weight: 1,
          cost: 800,
          color: "#FF6B6B",
          inStock: true,
        }),
        apiService.createClient({
          id: crypto.randomUUID(),
          userId: newUser.id,
          name: "Иванов И.И.",
          email: "ivanov@example.com",
          phone: "+7 (999) 123-45-67",
        }),
      ]);

      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      return { success: true };
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      return { success: false, error: "Произошла ошибка при регистрации. Попробуйте еще раз." };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
