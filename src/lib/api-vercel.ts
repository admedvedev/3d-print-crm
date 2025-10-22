// Vercel API implementation
const API_BASE_URL = '/api';

export const apiService = {
  // Users
  async getUsers() {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  async createUser(user: any) {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    if (!response.ok) throw new Error('Failed to create user');
    return response.json();
  },

  // Printers
  async getPrinters() {
    const response = await fetch(`${API_BASE_URL}/printers`);
    if (!response.ok) throw new Error('Failed to fetch printers');
    return response.json();
  },

  async createPrinter(printer: any) {
    const response = await fetch(`${API_BASE_URL}/printers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(printer),
    });
    if (!response.ok) throw new Error('Failed to create printer');
    return response.json();
  },

  async updatePrinter(id: string, printer: any) {
    const response = await fetch(`${API_BASE_URL}/printers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(printer),
    });
    if (!response.ok) throw new Error('Failed to update printer');
    return response.json();
  },

  async deletePrinter(id: string) {
    const response = await fetch(`${API_BASE_URL}/printers/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete printer');
    return response.json();
  },

  // Filaments
  async getFilaments() {
    const response = await fetch(`${API_BASE_URL}/filaments`);
    if (!response.ok) throw new Error('Failed to fetch filaments');
    return response.json();
  },

  async createFilament(filament: any) {
    const response = await fetch(`${API_BASE_URL}/filaments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filament),
    });
    if (!response.ok) throw new Error('Failed to create filament');
    return response.json();
  },

  async updateFilament(id: string, filament: any) {
    const response = await fetch(`${API_BASE_URL}/filaments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filament),
    });
    if (!response.ok) throw new Error('Failed to update filament');
    return response.json();
  },

  async deleteFilament(id: string) {
    const response = await fetch(`${API_BASE_URL}/filaments/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete filament');
    return response.json();
  },

  // Clients
  async getClients() {
    const response = await fetch(`${API_BASE_URL}/clients`);
    if (!response.ok) throw new Error('Failed to fetch clients');
    return response.json();
  },

  async createClient(client: any) {
    const response = await fetch(`${API_BASE_URL}/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(client),
    });
    if (!response.ok) throw new Error('Failed to create client');
    return response.json();
  },

  async updateClient(id: string, client: any) {
    const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(client),
    });
    if (!response.ok) throw new Error('Failed to update client');
    return response.json();
  },

  async deleteClient(id: string) {
    const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete client');
    return response.json();
  },

  // Orders
  async getOrders() {
    const response = await fetch(`${API_BASE_URL}/orders`);
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  },

  async createOrder(order: any) {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    if (!response.ok) throw new Error('Failed to create order');
    return response.json();
  },

  async updateOrder(id: string, order: any) {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    if (!response.ok) throw new Error('Failed to update order');
    return response.json();
  },

  async deleteOrder(id: string) {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete order');
    return response.json();
  },

  // Settings
  async getSettings() {
    const response = await fetch(`${API_BASE_URL}/settings`);
    if (!response.ok) throw new Error('Failed to fetch settings');
    return response.json();
  },

  async updateSettings(settings: any) {
    const response = await fetch(`${API_BASE_URL}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    if (!response.ok) throw new Error('Failed to update settings');
    return response.json();
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