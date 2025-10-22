import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calculator as CalcIcon } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext";
import { usePage } from "@/context/PageContext";

const Calculator = () => {
  const { printers, filaments, clients, calculateOrderCost, addOrder, currency, defaultMarkup } = useApp();
  const { setCurrentPageTitle } = usePage();
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentPageTitle("Калькулятор");
  }, [setCurrentPageTitle]);

  // Проверяем, что данные загружены
  if (!printers || !filaments || !clients) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="p-8 text-center">
          <CalcIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Загрузка данных...</h3>
          <p className="text-muted-foreground">Пожалуйста, подождите</p>
        </Card>
      </div>
    );
  }

  // Early return if no data available
  if (printers.length === 0 || filaments.length === 0 || clients.length === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="p-8 text-center">
          <CalcIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Для работы калькулятора нужны данные</h3>
          <p className="text-muted-foreground mb-4">
            Добавьте принтеры, пластики и клиентов, чтобы начать расчеты
          </p>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={() => navigate('/printers')}>
              Добавить принтеры
            </Button>
            <Button variant="outline" onClick={() => navigate('/filaments')}>
              Добавить пластики
            </Button>
            <Button variant="outline" onClick={() => navigate('/clients')}>
              Добавить клиентов
            </Button>
          </div>
        </Card>
      </div>
    );
  }
  
  const [formData, setFormData] = useState({
    taskName: "",
    clientId: "",
    printerId: "",
    filamentId: "",
    printTimeHours: "",
    printTimeMinutes: "",
    weight: "",
    markup: defaultMarkup.toString(),
  });
  const [calculatedCost, setCalculatedCost] = useState<number | null>(null);

  const handleCalculate = () => {
    try {
      if (!formData.taskName || !formData.clientId || !formData.printerId || !formData.filamentId) {
        toast.error("Пожалуйста, заполните все обязательные поля");
        return;
      }

      const cost = calculateOrderCost({
        printerId: formData.printerId,
        filamentId: formData.filamentId,
        printTimeHours: parseFloat(formData.printTimeHours) || 0,
        printTimeMinutes: parseFloat(formData.printTimeMinutes) || 0,
        weight: parseFloat(formData.weight) || 0,
        markup: parseFloat(formData.markup) || 0,
      });

      setCalculatedCost(cost);
      toast.success(`Рассчитанная стоимость: ${currency}${cost.toFixed(2)}`);
    } catch (error) {
      console.error('Ошибка при расчете стоимости:', error);
      toast.error("Произошла ошибка при расчете стоимости");
    }
  };

  const handleSaveOrder = () => {
    try {
      if (calculatedCost === null) {
        toast.error("Сначала рассчитайте стоимость");
        return;
      }

      const client = clients.find(c => c.id === formData.clientId);
      const printer = printers.find(p => p.id === formData.printerId);
      const filament = filaments.find(f => f.id === formData.filamentId);

      if (!client || !printer || !filament) {
        toast.error("Ошибка: данные не найдены");
        return;
      }

      addOrder({
        taskName: formData.taskName,
        clientId: formData.clientId,
        clientName: client.name,
        printerId: formData.printerId,
        printerName: printer.name,
        filamentId: formData.filamentId,
        filamentName: filament.name,
        printTimeHours: parseFloat(formData.printTimeHours) || 0,
        printTimeMinutes: parseFloat(formData.printTimeMinutes) || 0,
        weight: parseFloat(formData.weight) || 0,
        markup: parseFloat(formData.markup) || 0,
        status: "new",
        cost: calculatedCost,
        date: new Date().toISOString().split('T')[0],
      });

      toast.success("Заказ успешно создан!");
      setFormData({
        taskName: "",
        clientId: "",
        printerId: "",
        filamentId: "",
        printTimeHours: "",
        printTimeMinutes: "",
        weight: "",
        markup: defaultMarkup.toString(),
      });
      setCalculatedCost(null);
    } catch (error) {
      console.error('Ошибка при сохранении заказа:', error);
      toast.error("Произошла ошибка при сохранении заказа");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      <Card className="p-6 shadow-lg">
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="taskName">Название задания *</Label>
              <Input
                id="taskName"
                placeholder="Введите название"
                value={formData.taskName}
                onChange={(e) => setFormData({ ...formData, taskName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientId">Заказчик *</Label>
              <Select value={formData.clientId} onValueChange={(value) => setFormData({ ...formData, clientId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите заказчика" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="printerId">Принтер *</Label>
              <Select value={formData.printerId} onValueChange={(value) => setFormData({ ...formData, printerId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите принтер" />
                </SelectTrigger>
                <SelectContent>
                  {printers.map((printer) => (
                    <SelectItem key={printer.id} value={printer.id}>
                      {printer.name} ({printer.power}W)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filamentId">Пластик *</Label>
              <Select value={formData.filamentId} onValueChange={(value) => setFormData({ ...formData, filamentId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите пластик" />
                </SelectTrigger>
                <SelectContent>
                  {filaments.map((filament) => (
                    <SelectItem key={filament.id} value={filament.id}>
                      {filament.name} ({filament.weight}кг, {currency}{filament.cost})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="hours">Время печати (часы)</Label>
              <Input
                id="hours"
                type="number"
                min="0"
                placeholder="0"
                value={formData.printTimeHours}
                onChange={(e) => setFormData({ ...formData, printTimeHours: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minutes">Время печати (минуты)</Label>
              <Input
                id="minutes"
                type="number"
                min="0"
                max="59"
                placeholder="0"
                value={formData.printTimeMinutes}
                onChange={(e) => setFormData({ ...formData, printTimeMinutes: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Вес печати (г)</Label>
              <Input
                id="weight"
                type="number"
                min="0"
                placeholder="0"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="markup">Наценка (%)</Label>
            <Input
              id="markup"
              type="number"
              min="0"
              placeholder="20"
              value={formData.markup}
              onChange={(e) => setFormData({ ...formData, markup: e.target.value })}
            />
          </div>

          {calculatedCost !== null && (
            <Card className="p-4 bg-primary/10 border-primary">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Итоговая стоимость:</span>
                <span className="text-2xl font-bold text-primary">{currency}{calculatedCost.toFixed(2)}</span>
              </div>
            </Card>
          )}

          <div className="flex gap-3 pt-4">
            <Button onClick={handleCalculate} className="flex-1 shadow-md">
              <CalcIcon className="mr-2 h-4 w-4" />
              Рассчитать стоимость
            </Button>
            {calculatedCost !== null && (
              <Button onClick={handleSaveOrder} className="flex-1 shadow-md" variant="default">
                Сохранить заказ
              </Button>
            )}
            <Button variant="outline" onClick={() => {
              setFormData({
                taskName: "",
                clientId: "",
                printerId: "",
                filamentId: "",
                printTimeHours: "",
                printTimeMinutes: "",
                weight: "",
                markup: defaultMarkup.toString(),
              });
              setCalculatedCost(null);
            }}>
              Очистить
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Calculator;