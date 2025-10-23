// LocalStorage API implementation
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

  // Generic storage operations
  getStorageKey(table) {
    return `3d-print-crm-${table}`;
  }

  getData(table) {
    const key = this.getStorageKey(table);
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  setData(table, data) {
    const key = this.getStorageKey(table);
    localStorage.setItem(key, JSON.stringify(data));
  }

  generateId() {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  // Users
  async getUsers() {
    return this.getData('users');
  }

  async createUser(user) {
    const users = this.getData('users');
    const newUser = {
      id: this.generateId(),
      ...user,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    users.push(newUser);
    this.setData('users', users);
    return newUser;
  }

  // Printers
  async getPrinters() {
    const userId = this.getCurrentUserId();
    if (!userId) return [];
    const printers = this.getData('printers');
    return printers.filter((p) => p.userId === userId);
  }

  async createPrinter(printer) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
    const printers = this.getData('printers');
    const newPrinter = {
      id: this.generateId(),
      ...printer,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    printers.push(newPrinter);
    this.setData('printers', printers);
    return newPrinter;
  }

  async updatePrinter(id, printer) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
    const printers = this.getData('printers');
    const index = printers.findIndex(p => p.id === id && p.userId === userId);
    if (index === -1) throw new Error('Printer not found');
    
    printers[index] = {
      ...printers[index],
      ...printer,
      updatedAt: new Date().toISOString()
    };
    this.setData('printers', printers);
    return printers[index];
  }

  async deletePrinter(id) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
    const printers = this.getData('printers');
    const filteredPrinters = printers.filter(p => !(p.id === id && p.userId === userId));
    this.setData('printers', filteredPrinters);
    return { success: true };
  }

  // Filaments
  async getFilaments() {
    const userId = this.getCurrentUserId();
    if (!userId) return [];
    const filaments = this.getData('filaments');
    return filaments.filter((f) => f.userId === userId);
  }

  async createFilament(filament) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
    const filaments = this.getData('filaments');
    const newFilament = {
      id: this.generateId(),
      ...filament,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    filaments.push(newFilament);
    this.setData('filaments', filaments);
    return newFilament;
  }

  async updateFilament(id, filament) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
    const filaments = this.getData('filaments');
    const index = filaments.findIndex(f => f.id === id && f.userId === userId);
    if (index === -1) throw new Error('Filament not found');
    
    filaments[index] = {
      ...filaments[index],
      ...filament,
      updatedAt: new Date().toISOString()
    };
    this.setData('filaments', filaments);
    return filaments[index];
  }

  async deleteFilament(id) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
    const filaments = this.getData('filaments');
    const filteredFilaments = filaments.filter(f => !(f.id === id && f.userId === userId));
    this.setData('filaments', filteredFilaments);
    return { success: true };
  }

  // Clients
  async getClients() {
    const userId = this.getCurrentUserId();
    if (!userId) return [];
    const clients = this.getData('clients');
    return clients.filter((c) => c.userId === userId);
  }

  async createClient(client) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
    const clients = this.getData('clients');
    const newClient = {
      id: this.generateId(),
      ...client,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    clients.push(newClient);
    this.setData('clients', clients);
    return newClient;
  }

  async updateClient(id, client) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
    const clients = this.getData('clients');
    const index = clients.findIndex(c => c.id === id && c.userId === userId);
    if (index === -1) throw new Error('Client not found');
    
    clients[index] = {
      ...clients[index],
      ...client,
      updatedAt: new Date().toISOString()
    };
    this.setData('clients', clients);
    return clients[index];
  }

  async deleteClient(id) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
    const clients = this.getData('clients');
    const filteredClients = clients.filter(c => !(c.id === id && c.userId === userId));
    this.setData('clients', filteredClients);
    return { success: true };
  }

  // Orders
  async getOrders() {
    const userId = this.getCurrentUserId();
    if (!userId) return [];
    const orders = this.getData('orders');
    return orders.filter((o) => o.userId === userId);
  }

  async createOrder(order) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
    const orders = this.getData('orders');
    const newOrder = {
      id: this.generateId(),
      ...order,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    orders.push(newOrder);
    this.setData('orders', orders);
    return newOrder;
  }

  async updateOrder(id, order) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
    const orders = this.getData('orders');
    const index = orders.findIndex(o => o.id === id && o.userId === userId);
    if (index === -1) throw new Error('Order not found');
    
    orders[index] = {
      ...orders[index],
      ...order,
      updatedAt: new Date().toISOString()
    };
    this.setData('orders', orders);
    return orders[index];
  }

  async deleteOrder(id) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
    const orders = this.getData('orders');
    const filteredOrders = orders.filter(o => !(o.id === id && o.userId === userId));
    this.setData('orders', filteredOrders);
    return { success: true };
  }

  // Settings
  async getSettings() {
    const userId = this.getCurrentUserId();
    if (!userId) return { electricityRate: 5.5, currency: "₽", defaultMarkup: 20 };
    
    const settings = this.getData('settings');
    const userSettings = settings.find((s) => s.userId === userId);
    return userSettings || { electricityRate: 5.5, currency: "₽", defaultMarkup: 20 };
  }

  async createSettings(settings) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
    const allSettings = this.getData('settings');
    const newSettings = {
      id: this.generateId(),
      ...settings,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    allSettings.push(newSettings);
    this.setData('settings', allSettings);
    return newSettings;
  }

  async updateSettings(settings) {
    const userId = this.getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
    const allSettings = this.getData('settings');
    const index = allSettings.findIndex(s => s.userId === userId);
    
    if (index !== -1) {
      allSettings[index] = {
        ...allSettings[index],
        ...settings,
        updatedAt: new Date().toISOString()
      };
    } else {
      allSettings.push({
        id: this.generateId(),
        ...settings,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    this.setData('settings', allSettings);
    return allSettings[index] || allSettings[allSettings.length - 1];
  }
}

export const apiService = new ApiService();