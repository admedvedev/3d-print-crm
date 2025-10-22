export interface Printer {
  id: string;
  name: string;
  power: number; // Watts
  cost: number; // RUB
  depreciation: number; // percentage
  totalHours: number;
}

export interface Filament {
  id: string;
  name: string;
  weight: number; // kg
  cost: number; // RUB
  color: string;
  inStock: boolean;
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface Order {
  id: string;
  taskName: string;
  clientId: string;
  clientName: string;
  printerId: string;
  printerName: string;
  filamentId: string;
  filamentName: string;
  printTimeHours: number;
  printTimeMinutes: number;
  weight: number; // grams
  markup: number; // percentage
  status: "new" | "in_progress" | "completed" | "cancelled";
  cost: number;
  date: string;
}

export interface AppState {
  printers: Printer[];
  filaments: Filament[];
  clients: Client[];
  orders: Order[];
  electricityRate: number; // RUB per kWh
  currency: string;
  defaultMarkup: number;
}
