import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Printer, Loader2, LogOut } from "lucide-react";
import { usePage } from "@/context/PageContext";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { currentPageTitle, isChanging } = usePage();
  const { loading } = useApp();
  const { user, logout } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Загрузка данных...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen w-full bg-background">
      <header className="sticky top-0 z-40 h-16 border-b border-border bg-card flex items-center justify-between px-6 shadow-sm w-full">
        <div className="flex items-center gap-6">
          <Printer className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-primary">3D Print CRM</h1>
          <div className="h-8 w-px bg-border"></div>
          <h2 className={`text-2xl font-bold text-foreground ${isChanging ? 'page-title-animation changing' : ''}`}>{currentPageTitle}</h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Привет, {user?.name}!</span>
          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            Выйти
          </Button>
          <ThemeToggle />
        </div>
      </header>
      <div className="flex w-full min-h-[calc(100vh-4rem)]">
        <div className="sticky top-16 h-[calc(100vh-4rem)] flex items-center justify-center">
          <AppSidebar />
        </div>
        <main className="flex-1 bg-background p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}