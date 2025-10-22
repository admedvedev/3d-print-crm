import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { AppState, Printer, Filament, Client, Order } from "@/types";
import { getDefaultApiService } from "@/lib/api-switch";

interface AppContextType extends AppState {
  addPrinter: (printer: Omit<Printer, "id">) => void;
  updatePrinter: (id: string, printer: Partial<Printer>) => void;
  deletePrinter: (id: string) => void;
  addFilament: (filament: Omit<Filament, "id">) => void;
  updateFilament: (id: string, filament: Partial<Filament>) => void;
  deleteFilament: (id: string) => void;
  addClient: (client: Omit<Client, "id">) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addOrder: (order: Omit<Order, "id">) => void;
  updateOrder: (id: string, order: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  updateSettings: (settings: Partial<Pick<AppState, "electricityRate" | "currency" | "defaultMarkup">>) => void;
  resetToInitialState: () => void;
  calculateOrderCost: (params: {
    printerId: string;
    filamentId: string;
    printTimeHours: number;
    printTimeMinutes: number;
    weight: number;
    markup: number;
  }) => number;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialState: AppState = {
  printers: [],
  filaments: [],
  clients: [],
  orders: [],
  electricityRate: 5.5,
  currency: "₽",
  defaultMarkup: 20,
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
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

  // Загружаем данные из API при инициализации
  useEffect(() => {
    if (!apiService) return;
    
    const loadData = async () => {
      try {
        setLoading(true);
        const [printers, filaments, clients, orders, settings] = await Promise.all([
          apiService.getPrinters(),
          apiService.getFilaments(),
          apiService.getClients(),
          apiService.getOrders(),
          apiService.getSettings(),
        ]);

        setState({
          printers,
          filaments,
          clients,
          orders,
          electricityRate: settings.electricityRate || 5.5,
          currency: settings.currency || "₽",
          defaultMarkup: settings.defaultMarkup || 20,
        });
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        // Используем начальные данные при ошибке
        setState(initialState);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [apiService]);

  const calculateOrderCost = ({
    printerId,
    filamentId,
    printTimeHours,
    printTimeMinutes,
    weight,
    markup,
  }: {
    printerId: string;
    filamentId: string;
    printTimeHours: number;
    printTimeMinutes: number;
    weight: number;
    markup: number;
  }) => {
    const printer = state.printers.find(p => p.id === printerId);
    const filament = state.filaments.find(f => f.id === filamentId);

    if (!printer || !filament) {
      throw new Error("Принтер или пластик не найден");
    }

    const totalHours = printTimeHours + printTimeMinutes / 60;
    const electricityCost = (printer.power * totalHours * state.electricityRate) / 1000;
    const filamentCost = (weight / 1000) * (filament.cost / filament.weight);
    const depreciationCost = (printer.cost * printer.depreciation / 100) * (totalHours / 8760);
    const baseCost = electricityCost + filamentCost + depreciationCost;
    const finalCost = baseCost * (1 + markup / 100);

    return Math.round(finalCost * 100) / 100;
  };

  const addPrinter = async (printer: Omit<Printer, "id">) => {
    if (!apiService) return;
    try {
      const newPrinter = await apiService.createPrinter({ ...printer, id: crypto.randomUUID() });
      setState(prev => ({ ...prev, printers: [...prev.printers, newPrinter] }));
    } catch (error) {
      console.error('Ошибка добавления принтера:', error);
    }
  };

  const updatePrinter = async (id: string, printer: Partial<Printer>) => {
    if (!apiService) return;
    try {
      const updatedPrinter = await apiService.updatePrinter(id, printer);
      setState(prev => ({
        ...prev,
        printers: prev.printers.map(p => p.id === id ? updatedPrinter : p)
      }));
    } catch (error) {
      console.error('Ошибка обновления принтера:', error);
    }
  };

  const deletePrinter = async (id: string) => {
    if (!apiService) return;
    try {
      await apiService.deletePrinter(id);
      setState(prev => ({ ...prev, printers: prev.printers.filter(p => p.id !== id) }));
    } catch (error) {
      console.error('Ошибка удаления принтера:', error);
    }
  };

  const addFilament = async (filament: Omit<Filament, "id">) => {
    if (!apiService) return;
    try {
      const newFilament = await apiService.createFilament({ ...filament, id: crypto.randomUUID() });
      setState(prev => ({ ...prev, filaments: [...prev.filaments, newFilament] }));
    } catch (error) {
      console.error('Ошибка добавления пластика:', error);
    }
  };

  const updateFilament = async (id: string, filament: Partial<Filament>) => {
    if (!apiService) return;
    try {
      const updatedFilament = await apiService.updateFilament(id, filament);
      setState(prev => ({
        ...prev,
        filaments: prev.filaments.map(f => f.id === id ? updatedFilament : f)
      }));
    } catch (error) {
      console.error('Ошибка обновления пластика:', error);
    }
  };

  const deleteFilament = async (id: string) => {
    if (!apiService) return;
    try {
      await apiService.deleteFilament(id);
      setState(prev => ({ ...prev, filaments: prev.filaments.filter(f => f.id !== id) }));
    } catch (error) {
      console.error('Ошибка удаления пластика:', error);
    }
  };

  const addClient = async (client: Omit<Client, "id">) => {
    if (!apiService) return;
    try {
      const newClient = await apiService.createClient({ ...client, id: crypto.randomUUID() });
      setState(prev => ({ ...prev, clients: [...prev.clients, newClient] }));
    } catch (error) {
      console.error('Ошибка добавления клиента:', error);
    }
  };

  const updateClient = async (id: string, client: Partial<Client>) => {
    if (!apiService) return;
    try {
      const updatedClient = await apiService.updateClient(id, client);
      setState(prev => ({
        ...prev,
        clients: prev.clients.map(c => c.id === id ? updatedClient : c)
      }));
    } catch (error) {
      console.error('Ошибка обновления клиента:', error);
    }
  };

  const deleteClient = async (id: string) => {
    if (!apiService) return;
    try {
      await apiService.deleteClient(id);
      setState(prev => ({ ...prev, clients: prev.clients.filter(c => c.id !== id) }));
    } catch (error) {
      console.error('Ошибка удаления клиента:', error);
    }
  };

  const addOrder = async (order: Omit<Order, "id">) => {
    if (!apiService) return;
    try {
      const newOrder = await apiService.createOrder({ ...order, id: crypto.randomUUID() });
      setState(prev => ({ ...prev, orders: [...prev.orders, newOrder] }));
    } catch (error) {
      console.error('Ошибка добавления заказа:', error);
    }
  };

  const updateOrder = async (id: string, order: Partial<Order>) => {
    if (!apiService) return;
    try {
      const updatedOrder = await apiService.updateOrder(id, order);
      setState(prev => ({
        ...prev,
        orders: prev.orders.map(o => o.id === id ? updatedOrder : o)
      }));
    } catch (error) {
      console.error('Ошибка обновления заказа:', error);
    }
  };

  const deleteOrder = async (id: string) => {
    if (!apiService) return;
    try {
      await apiService.deleteOrder(id);
      setState(prev => ({ ...prev, orders: prev.orders.filter(o => o.id !== id) }));
    } catch (error) {
      console.error('Ошибка удаления заказа:', error);
    }
  };

  const updateSettings = async (settings: Partial<Pick<AppState, "electricityRate" | "currency" | "defaultMarkup">>) => {
    if (!apiService) return;
    try {
      await apiService.updateSettings(settings);
      setState((prev) => ({ ...prev, ...settings }));
    } catch (error) {
      console.error('Ошибка обновления настроек:', error);
    }
  };

  const resetToInitialState = async () => {
    if (!apiService) return;
    try {
      // Очищаем все данные через API
      await Promise.all([
        ...state.printers.map(p => apiService.deletePrinter(p.id)),
        ...state.filaments.map(f => apiService.deleteFilament(f.id)),
        ...state.clients.map(c => apiService.deleteClient(c.id)),
        ...state.orders.map(o => apiService.deleteOrder(o.id)),
      ]);
      
      // Сбрасываем настройки
      await apiService.updateSettings({
        electricityRate: 5.5,
        currency: "₽",
        defaultMarkup: 20,
      });
      
      setState(initialState);
    } catch (error) {
      console.error('Ошибка сброса данных:', error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        loading,
        addPrinter,
        updatePrinter,
        deletePrinter,
        addFilament,
        updateFilament,
        deleteFilament,
        addClient,
        updateClient,
        deleteClient,
        addOrder,
        updateOrder,
        deleteOrder,
        updateSettings,
        resetToInitialState,
        calculateOrderCost,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
