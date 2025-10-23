import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Calculator,
  Package,
  Printer,
  Cylinder,
  Users,
  Settings,
  Bug,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const menuItems = [
  {
    title: "Панель управления",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Калькулятор",
    url: "/calculator",
    icon: Calculator,
  },
  {
    title: "Заказы",
    url: "/orders",
    icon: Package,
  },
  {
    title: "Принтеры",
    url: "/printers",
    icon: Printer,
  },
  {
    title: "Пластик",
    url: "/filaments",
    icon: Cylinder,
  },
  {
    title: "Клиенты",
    url: "/clients",
    icon: Users,
  },
  {
    title: "Настройки",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "Диагностика",
    url: "/diagnostics",
    icon: Bug,
  },
];

export function AppSidebar() {
  return (
    <TooltipProvider>
      <div className="w-16 bg-sidebar/95 backdrop-blur-sm border border-sidebar-border flex flex-col rounded-xl m-2 modern-sidebar">
        <div className="flex flex-col items-center py-4 space-y-2">
          {menuItems.map((item) => (
            <Tooltip key={item.title}>
              <TooltipTrigger asChild>
                <NavLink
                  to={item.url}
                  end={item.url === "/"}
                  className={({ isActive }) =>
                    `group relative flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-300 sidebar-icon-hover ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-primary"
                    }`
                  }
                >
                  <item.icon className="h-6 w-6 relative z-10" />
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="right" align="center" className="ml-3 z-50">
                <p className="text-sm font-medium">{item.title}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
