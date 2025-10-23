import { supabase } from './supabase'

class SupabaseApiService {
  getCurrentUserId() {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        return JSON.parse(user).id;
      } catch {
        return null;
      }
    }
    return null;
  }

  // Преобразование snake_case в camelCase для чтения данных
  convertToCamelCase(data) {
    if (Array.isArray(data)) {
      return data.map(item => this.convertToCamelCase(item));
    }
    
    if (data && typeof data === 'object') {
      const converted = {};
      for (const [key, value] of Object.entries(data)) {
        const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        converted[camelKey] = this.convertToCamelCase(value);
      }
      return converted;
    }
    
    return data;
  }

  // Users
  async getUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return this.convertToCamelCase(data || []);
  }

  async createUser(user) {
    // Преобразуем camelCase в snake_case для Supabase
    const userData = {
      email: user.email,
      password: user.password,
      name: user.name
    };
    
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    
    if (error) throw error;
    return this.convertToCamelCase(data);
  }

  // Printers
  async getPrinters() {
    const userId = this.getCurrentUserId();
    if (!userId) return [];
    
    const { data, error } = await supabase
      .from('printers')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return this.convertToCamelCase(data || []);
  }

  async createPrinter(printer) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
    // Преобразуем camelCase в snake_case для Supabase
    const printerData = {
      user_id: userId,
      name: printer.name,
      power: printer.power,
      cost: printer.cost,
      depreciation: printer.depreciation,
      total_hours: printer.totalHours
    };
    
    const { data, error } = await supabase
      .from('printers')
      .insert([printerData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updatePrinter(id, printer) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
    // Преобразуем camelCase в snake_case для Supabase
    const printerData = {
      name: printer.name,
      power: printer.power,
      cost: printer.cost,
      depreciation: printer.depreciation,
      total_hours: printer.totalHours
    };
    
    const { data, error } = await supabase
      .from('printers')
      .update(printerData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deletePrinter(id) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
    const { error } = await supabase
      .from('printers')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    if (error) throw error;
    return { success: true };
  }

  // Filaments
  async getFilaments() {
    const userId = this.getCurrentUserId();
    if (!userId) return [];
    
    const { data, error } = await supabase
      .from('filaments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async createFilament(filament) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
    // Преобразуем camelCase в snake_case для Supabase
    const filamentData = {
      user_id: userId,
      name: filament.name,
      weight: filament.weight,
      cost: filament.cost,
      color: filament.color,
      in_stock: filament.inStock
    };
    
    const { data, error } = await supabase
      .from('filaments')
      .insert([filamentData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateFilament(id, filament) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
    // Преобразуем camelCase в snake_case для Supabase
    const filamentData = {
      name: filament.name,
      weight: filament.weight,
      cost: filament.cost,
      color: filament.color,
      in_stock: filament.inStock
    };
    
    const { data, error } = await supabase
      .from('filaments')
      .update(filamentData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteFilament(id) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
    const { error } = await supabase
      .from('filaments')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    if (error) throw error;
    return { success: true };
  }

  // Clients
  async getClients() {
    const userId = this.getCurrentUserId();
    if (!userId) return [];
    
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async createClient(client) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
    // Преобразуем camelCase в snake_case для Supabase
    const clientData = {
      user_id: userId,
      name: client.name,
      email: client.email,
      phone: client.phone
    };
    
    const { data, error } = await supabase
      .from('clients')
      .insert([clientData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateClient(id, client) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
    // Преобразуем camelCase в snake_case для Supabase
    const clientData = {
      name: client.name,
      email: client.email,
      phone: client.phone
    };
    
    const { data, error } = await supabase
      .from('clients')
      .update(clientData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteClient(id) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    if (error) throw error;
    return { success: true };
  }

  // Orders
  async getOrders() {
    const userId = this.getCurrentUserId();
    if (!userId) return [];
    
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async createOrder(order) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
    // Преобразуем camelCase в snake_case для Supabase
    const orderData = {
      user_id: userId,
      task_name: order.taskName,
      client_id: order.clientId,
      client_name: order.clientName,
      printer_id: order.printerId,
      printer_name: order.printerName,
      filament_id: order.filamentId,
      filament_name: order.filamentName,
      print_time_hours: order.printTimeHours,
      print_time_minutes: order.printTimeMinutes,
      weight: order.weight,
      markup: order.markup,
      status: order.status,
      cost: order.cost,
      date: order.date
    };
    
    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateOrder(id, order) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
    // Преобразуем camelCase в snake_case для Supabase
    const orderData = {
      task_name: order.taskName,
      client_id: order.clientId,
      client_name: order.clientName,
      printer_id: order.printerId,
      printer_name: order.printerName,
      filament_id: order.filamentId,
      filament_name: order.filamentName,
      print_time_hours: order.printTimeHours,
      print_time_minutes: order.printTimeMinutes,
      weight: order.weight,
      markup: order.markup,
      status: order.status,
      cost: order.cost,
      date: order.date
    };
    
    const { data, error } = await supabase
      .from('orders')
      .update(orderData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteOrder(id) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    if (error) throw error;
    return { success: true };
  }

  // Settings
  async getSettings() {
    const userId = this.getCurrentUserId();
    if (!userId) return { electricityRate: 5.5, currency: "₽", defaultMarkup: 20 };
    
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data || { electricityRate: 5.5, currency: "₽", defaultMarkup: 20 };
  }

  async createSettings(settings) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
    // Преобразуем camelCase в snake_case для Supabase
    const settingsData = {
      user_id: userId,
      electricity_rate: settings.electricityRate,
      currency: settings.currency,
      default_markup: settings.defaultMarkup
    };
    
    const { data, error } = await supabase
      .from('settings')
      .insert([settingsData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateSettings(settings) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
    // Преобразуем camelCase в snake_case для Supabase
    const settingsData = {
      electricity_rate: settings.electricityRate,
      currency: settings.currency,
      default_markup: settings.defaultMarkup
    };
    
    // Сначала проверяем, есть ли настройки
    const { data: existingSettings } = await supabase
      .from('settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (existingSettings) {
      // Обновляем существующие настройки
      const { data, error } = await supabase
        .from('settings')
        .update(settingsData)
        .eq('user_id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      // Создаем новые настройки
      return this.createSettings(settings);
    }
  }
}

export const apiService = new SupabaseApiService();
