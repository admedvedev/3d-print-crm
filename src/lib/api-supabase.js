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

  // Users
  async getUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async createUser(user) {
    const { data, error } = await supabase
      .from('users')
      .insert([user])
      .select()
      .single();
    
    if (error) throw error;
    return data;
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
    return data || [];
  }

  async createPrinter(printer) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('printers')
      .insert([{ ...printer, user_id: userId }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updatePrinter(id, printer) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('printers')
      .update(printer)
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
    
    const { data, error } = await supabase
      .from('filaments')
      .insert([{ ...filament, user_id: userId }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateFilament(id, filament) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('filaments')
      .update(filament)
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
    
    const { data, error } = await supabase
      .from('clients')
      .insert([{ ...client, user_id: userId }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateClient(id, client) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('clients')
      .update(client)
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
    
    const { data, error } = await supabase
      .from('orders')
      .insert([{ ...order, user_id: userId }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateOrder(id, order) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('orders')
      .update(order)
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
    
    const { data, error } = await supabase
      .from('settings')
      .insert([{ ...settings, user_id: userId }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateSettings(settings) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
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
        .update(settings)
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
