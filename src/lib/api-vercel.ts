// API service for Vercel deployment
const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:3000/api'
  : '/api';

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

class ApiService {
  private getCurrentUserId(): string | null {
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

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Users
  async getUsers() {
    return this.request('/db?table=users');
  }

  async createUser(user: any) {
    return this.request('/db?table=users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  // Printers
  async getPrinters() {
    const userId = this.getCurrentUserId();
    if (!userId) return [];
    const printers = await this.request('/db?table=printers');
    return printers.filter((p: any) => p.userId === userId);
  }

  async createPrinter(printer: any) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    return this.request('/db?table=printers', {
      method: 'POST',
      body: JSON.stringify({ ...printer, userId }),
    });
  }

  async updatePrinter(id: string, printer: any) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    return this.request(`/db?table=printers&id=${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...printer, userId }),
    });
  }

  async deletePrinter(id: string) {
    return this.request(`/db?table=printers&id=${id}`, {
      method: 'DELETE',
    });
  }

  // Filaments
  async getFilaments() {
    const userId = this.getCurrentUserId();
    if (!userId) return [];
    const filaments = await this.request('/db?table=filaments');
    return filaments.filter((f: any) => f.userId === userId);
  }

  async createFilament(filament: any) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    return this.request('/db?table=filaments', {
      method: 'POST',
      body: JSON.stringify({ ...filament, userId }),
    });
  }

  async updateFilament(id: string, filament: any) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    return this.request(`/db?table=filaments&id=${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...filament, userId }),
    });
  }

  async deleteFilament(id: string) {
    return this.request(`/db?table=filaments&id=${id}`, {
      method: 'DELETE',
    });
  }

  // Clients
  async getClients() {
    const userId = this.getCurrentUserId();
    if (!userId) return [];
    const clients = await this.request('/db?table=clients');
    return clients.filter((c: any) => c.userId === userId);
  }

  async createClient(client: any) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    return this.request('/db?table=clients', {
      method: 'POST',
      body: JSON.stringify({ ...client, userId }),
    });
  }

  async updateClient(id: string, client: any) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    return this.request(`/db?table=clients&id=${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...client, userId }),
    });
  }

  async deleteClient(id: string) {
    return this.request(`/db?table=clients&id=${id}`, {
      method: 'DELETE',
    });
  }

  // Orders
  async getOrders() {
    const userId = this.getCurrentUserId();
    if (!userId) return [];
    const orders = await this.request('/db?table=orders');
    return orders.filter((o: any) => o.userId === userId);
  }

  async createOrder(order: any) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    return this.request('/db?table=orders', {
      method: 'POST',
      body: JSON.stringify({ ...order, userId }),
    });
  }

  async updateOrder(id: string, order: any) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    return this.request(`/db?table=orders&id=${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...order, userId }),
    });
  }

  async deleteOrder(id: string) {
    return this.request(`/db?table=orders&id=${id}`, {
      method: 'DELETE',
    });
  }

  // Settings
  async getSettings() {
    const userId = this.getCurrentUserId();
    if (!userId) return { electricityRate: 5.5, currency: "₽", defaultMarkup: 20 };
    const settings = await this.request('/db?table=settings');
    const userSettings = settings.find((s: any) => s.userId === userId);
    return userSettings || { electricityRate: 5.5, currency: "₽", defaultMarkup: 20 };
  }

  async createSettings(settings: any) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    return this.request('/db?table=settings', {
      method: 'POST',
      body: JSON.stringify({ ...settings, userId }),
    });
  }

  async updateSettings(settings: any) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
    // Сначала получаем существующие настройки
    const existingSettings = await this.request('/db?table=settings');
    const userSettings = existingSettings.find((s: any) => s.userId === userId);
    
    if (userSettings) {
      return this.request(`/db?table=settings&id=${userSettings.id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...userSettings, ...settings }),
      });
    } else {
      return this.request('/db?table=settings', {
        method: 'POST',
        body: JSON.stringify({ ...settings, userId }),
      });
    }
  }
}

export const apiService = new ApiService();
