import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Package, Printer, TrendingUp, Users } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { usePage } from "@/context/PageContext";
import { useEffect } from "react";

const Dashboard = () => {
  const { orders, clients, printers } = useApp();
  const { setCurrentPageTitle } = usePage();

  useEffect(() => {
    setCurrentPageTitle("Панель управления");
  }, [setCurrentPageTitle]);

  const stats = {
    totalOrders: orders.length,
    totalClients: clients.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.cost, 0),
    printersValue: printers.reduce((sum, printer) => sum + printer.cost, 0),
    completedOrders: orders.filter(order => order.status === "completed").length,
  };

  const recentOrders = orders.slice(-5).reverse();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6 shadow-md">
          <div className="flex items-center">
            <Package className="h-4 w-4 text-muted-foreground" />
            <div className="ml-2">
              <p className="text-sm font-medium leading-none">Всего заказов</p>
              <p className="text-2xl font-bold">{stats.totalOrders}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 shadow-md">
          <div className="flex items-center">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <div className="ml-2">
              <p className="text-sm font-medium leading-none">Клиенты</p>
              <p className="text-2xl font-bold">{stats.totalClients}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 shadow-md">
          <div className="flex items-center">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <div className="ml-2">
              <p className="text-sm font-medium leading-none">Выручка</p>
              <p className="text-2xl font-bold">₽{stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 shadow-md">
          <div className="flex items-center">
            <Printer className="h-4 w-4 text-muted-foreground" />
            <div className="ml-2">
              <p className="text-sm font-medium leading-none">Стоимость принтеров</p>
              <p className="text-2xl font-bold">₽{stats.printersValue.toFixed(2)}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 shadow-md">
          <h3 className="text-lg font-semibold mb-4">Последние заказы</h3>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground">Нет заказов</p>
          ) : (
            <div className="space-y-2">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{order.taskName}</p>
                    <p className="text-sm text-muted-foreground">{order.clientName}</p>
                    <p className="text-xs text-muted-foreground">Принтер: {order.printerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₽{order.cost.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">{order.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6 shadow-md">
          <h3 className="text-lg font-semibold mb-4">Статистика по принтерам</h3>
          {printers.length === 0 ? (
            <p className="text-sm text-muted-foreground">Нет принтеров</p>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <p className="text-sm font-medium text-primary">Завершенных заданий</p>
                <p className="text-2xl font-bold text-primary">{stats.completedOrders}</p>
              </div>
              <div className="space-y-2">
                {printers.map((printer) => (
                  <div key={printer.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{printer.name}</p>
                      <p className="text-sm text-muted-foreground">{printer.power}W</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₽{printer.cost.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">{printer.totalHours}ч</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;