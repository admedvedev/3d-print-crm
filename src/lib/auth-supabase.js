// Простая аутентификация для Supabase
import { supabase } from './supabase'

export class AuthService {
  // Регистрация пользователя
  async register(email, password, name) {
    try {
      console.log('🔐 Регистрация пользователя:', email);
      
      // Создаем пользователя в таблице users
      const { data, error } = await supabase
        .from('users')
        .insert([{
          email: email,
          password: password, // В реальном проекте нужно хешировать пароль
          name: name
        }])
        .select()
        .single();
      
      if (error) {
        console.error('❌ Ошибка регистрации:', error);
        throw error;
      }
      
      console.log('✅ Пользователь зарегистрирован:', data);
      
      // Сохраняем пользователя в localStorage
      localStorage.setItem('user', JSON.stringify(data));
      
      return data;
    } catch (error) {
      console.error('❌ Ошибка регистрации:', error);
      throw error;
    }
  }

  // Вход в систему
  async login(email, password) {
    try {
      console.log('🔐 Вход в систему:', email);
      
      // Ищем пользователя по email и паролю
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();
      
      if (error) {
        console.error('❌ Ошибка входа:', error);
        throw new Error('Неверный email или пароль');
      }
      
      if (!data) {
        throw new Error('Пользователь не найден');
      }
      
      console.log('✅ Пользователь вошел в систему:', data);
      
      // Сохраняем пользователя в localStorage
      localStorage.setItem('user', JSON.stringify(data));
      
      return data;
    } catch (error) {
      console.error('❌ Ошибка входа:', error);
      throw error;
    }
  }

  // Выход из системы
  logout() {
    console.log('🔐 Выход из системы');
    localStorage.removeItem('user');
  }

  // Получить текущего пользователя
  getCurrentUser() {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        return JSON.parse(user);
      } catch {
        return null;
      }
    }
    return null;
  }

  // Проверить, авторизован ли пользователь
  isAuthenticated() {
    return !!this.getCurrentUser();
  }
}

export const authService = new AuthService();
