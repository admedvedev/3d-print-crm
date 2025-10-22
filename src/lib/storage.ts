import { AppState } from "@/types";

const STORAGE_KEY = "3d-print-crm-data";

// Функция для загрузки данных из localStorage
export const loadDataFromStorage = (): AppState | null => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      return JSON.parse(storedData);
    }
  } catch (error) {
    console.error("Ошибка при загрузке данных из localStorage:", error);
  }
  return null;
};

// Функция для сохранения данных в localStorage
export const saveDataToStorage = (data: AppState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Ошибка при сохранении данных в localStorage:", error);
  }
};

// Функция для очистки данных из localStorage
export const clearStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Ошибка при очистке localStorage:", error);
  }
};

// Функция для проверки наличия данных в localStorage
export const hasStoredData = (): boolean => {
  return localStorage.getItem(STORAGE_KEY) !== null;
};
