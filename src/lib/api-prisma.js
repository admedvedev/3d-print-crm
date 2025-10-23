// Prisma API implementation for production
const API_BASE_URL = '/api';

export const apiService = {
  // Generic request function
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
  },

  // Users
  async getUsers() {
    return this.request('/database?table=users');
  },

  async createUser(user) {
    return this.request('/database?table=users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  },

  async updateUser(id, user) {
    return this.request(`/database?table=users&id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    });
  },

  async deleteUser(id) {
    return this.request(`/database?table=users&id=${id}`, {
      method: 'DELETE',
    });
  },

  // Printers
  async getPrinters() {
    return this.request('/database?table=printers');
  },

  async createPrinter(printer) {
    return this.request('/database?table=printers', {
      method: 'POST',
      body: JSON.stringify(printer),
    });
  },

  async updatePrinter(id, printer) {
    return this.request(`/database?table=printers&id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(printer),
    });
  },

  async deletePrinter(id) {
    return this.request(`/database?table=printers&id=${id}`, {
      method: 'DELETE',
    });
  },

  // Filaments
  async getFilaments() {
    return this.request('/database?table=filaments');
  },

  async createFilament(filament) {
    return this.request('/database?table=filaments', {
      method: 'POST',
      body: JSON.stringify(filament),
    });
  },

  async updateFilament(id, filament) {
    return this.request(`/database?table=filaments&id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(filament),
    });
  },

  async deleteFilament(id) {
    return this.request(`/database?table=filaments&id=${id}`, {
      method: 'DELETE',
    });
  },

  // Clients
  async getClients() {
    return this.request('/database?table=clients');
  },

  async createClient(client) {
    return this.request('/database?table=clients', {
      method: 'POST',
      body: JSON.stringify(client),
    });
  },

  async updateClient(id, client) {
    return this.request(`/database?table=clients&id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(client),
    });
  },

  async deleteClient(id) {
    return this.request(`/database?table=clients&id=${id}`, {
      method: 'DELETE',
    });
  },

  // Orders
  async getOrders() {
    return this.request('/database?table=orders');
  },

  async createOrder(order) {
    return this.request('/database?table=orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  },

  async updateOrder(id, order) {
    return this.request(`/database?table=orders&id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(order),
    });
  },

  async deleteOrder(id) {
    return this.request(`/database?table=orders&id=${id}`, {
      method: 'DELETE',
    });
  },

  // Settings
  async getSettings() {
    return this.request('/database?table=settings');
  },

  async createSettings(settings) {
    return this.request('/database?table=settings', {
      method: 'POST',
      body: JSON.stringify(settings),
    });
  },

  async updateSettings(settings) {
    // Для настроек используем первый ID, если есть
    const existingSettings = await this.getSettings();
    if (existingSettings.length > 0) {
      return this.request(`/database?table=settings&id=${existingSettings[0].id}`, {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
    } else {
      return this.createSettings(settings);
    }
  },

  // Utility
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
  },
};
