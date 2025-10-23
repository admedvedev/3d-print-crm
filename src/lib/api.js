const API_BASE_URL = 'http://localhost:3001';

class ApiService {
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

  async request(endpoint, options = {}) {
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
    return this.request('/users');
  }

  async createUser(user) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  // Printers
  async getPrinters() {
    const userId = this.getCurrentUserId();
    if (!userId) return [];
    const printers = await this.request('/printers');
    return printers.filter((p) => p.userId === userId);
  }

  async createPrinter(printer) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    return this.request('/printers', {
      method: 'POST',
      body: JSON.stringify({ ...printer, userId }),
    });
  }

  async updatePrinter(id, printer) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    return this.request(`/printers/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...printer, userId }),
    });
  }

  async deletePrinter(id) {
    return this.request(`/printers/${id}`, {
      method: 'DELETE',
    });
  }

  // Filaments
  async getFilaments() {
    const userId = this.getCurrentUserId();
    if (!userId) return [];
    const filaments = await this.request('/filaments');
    return filaments.filter((f) => f.userId === userId);
  }

  async createFilament(filament) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    return this.request('/filaments', {
      method: 'POST',
      body: JSON.stringify({ ...filament, userId }),
    });
  }

  async updateFilament(id, filament) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    return this.request(`/filaments/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...filament, userId }),
    });
  }

  async deleteFilament(id) {
    return this.request(`/filaments/${id}`, {
      method: 'DELETE',
    });
  }

  // Clients
  async getClients() {
    const userId = this.getCurrentUserId();
    if (!userId) return [];
    const clients = await this.request('/clients');
    return clients.filter((c) => c.userId === userId);
  }

  async createClient(client) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    return this.request('/clients', {
      method: 'POST',
      body: JSON.stringify({ ...client, userId }),
    });
  }

  async updateClient(id, client) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    return this.request(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...client, userId }),
    });
  }

  async deleteClient(id) {
    return this.request(`/clients/${id}`, {
      method: 'DELETE',
    });
  }

  // Orders
  async getOrders() {
    const userId = this.getCurrentUserId();
    if (!userId) return [];
    const orders = await this.request('/orders');
    return orders.filter((o) => o.userId === userId);
  }

  async createOrder(order) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify({ ...order, userId }),
    });
  }

  async updateOrder(id, order) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    return this.request(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...order, userId }),
    });
  }

  async deleteOrder(id) {
    return this.request(`/orders/${id}`, {
      method: 'DELETE',
    });
  }

  // Settings
  async getSettings() {
    const userId = this.getCurrentUserId();
    if (!userId) return { electricityRate: 5.5, currency: "₽", defaultMarkup: 20 };
    const settings = await this.request('/settings');
    const userSettings = settings.find((s) => s.userId === userId);
    return userSettings || { electricityRate: 5.5, currency: "₽", defaultMarkup: 20 };
  }

  async createSettings(settings) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    return this.request('/settings', {
      method: 'POST',
      body: JSON.stringify({ ...settings, userId }),
    });
  }

  async updateSettings(settings) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
    // Сначала получаем существующие настройки
    const existingSettings = await this.request('/settings');
    const userSettings = existingSettings.find((s) => s.userId === userId);
    
    if (userSettings) {
      return this.request(`/settings/${userSettings.id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...userSettings, ...settings }),
      });
    } else {
      return this.request('/settings', {
        method: 'POST',
        body: JSON.stringify({ ...settings, userId }),
      });
    }
  }
}

export const apiService = new ApiService();