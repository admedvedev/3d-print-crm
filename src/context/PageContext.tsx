import { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface PageContextType {
  currentPageTitle: string;
  setCurrentPageTitle: (title: string) => void;
  isChanging: boolean;
}

const PageContext = createContext<PageContextType | undefined>(undefined);

export const usePage = () => {
  const context = useContext(PageContext);
  if (context === undefined) {
    throw new Error("usePage must be used within a PageProvider");
  }
  return context;
};

interface PageProviderProps {
  children: ReactNode;
}

export const PageProvider = ({ children }: PageProviderProps) => {
  const [currentPageTitle, setCurrentPageTitleState] = useState("Панель управления");
  const [isChanging, setIsChanging] = useState(false);

  const setCurrentPageTitle = useCallback((title: string) => {
    if (title !== currentPageTitle) {
      // Устанавливаем новый заголовок
      setCurrentPageTitleState(title);
      
      // Запускаем анимацию
      setIsChanging(true);
      
      // Сбрасываем флаг анимации через небольшую задержку
      setTimeout(() => {
        setIsChanging(false);
      }, 300);
    }
  }, [currentPageTitle]);

  return (
    <PageContext.Provider value={{ currentPageTitle, setCurrentPageTitle, isChanging }}>
      {children}
    </PageContext.Provider>
  );
};