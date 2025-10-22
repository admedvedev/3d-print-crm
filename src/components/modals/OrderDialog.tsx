import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Order } from "@/types";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

interface OrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order?: Order;
  onSave: (order: Omit<Order, "id"> | Order) => void;
}

export function OrderDialog({ open, onOpenChange, order, onSave }: OrderDialogProps) {
  const { printers, filaments, clients, calculateOrderCost, defaultMarkup } = useApp();
  
  const [formData, setFormData] = useState({
    taskName: "",
    clientId: "",
    printerId: "",
    filamentId: "",
    printTimeHours: "",
    printTimeMinutes: "",
    weight: "",
    markup: defaultMarkup.toString(),
    status: "new" as Order["status"],
  });

  useEffect(() => {
    if (order) {
      setFormData({
        taskName: order.taskName,
        clientId: order.clientId,
        printerId: order.printerId,
        filamentId: order.filamentId,
        printTimeHours: order.printTimeHours.toString(),
        printTimeMinutes: order.printTimeMinutes.toString(),
        weight: order.weight.toString(),
        markup: order.markup.toString(),
        status: order.status,
      });
    } else {
      setFormData({
        taskName: "",
        clientId: "",
        printerId: "",
        filamentId: "",
        printTimeHours: "",
        printTimeMinutes: "",
        weight: "",
        markup: defaultMarkup.toString(),
        status: "new",
      });
    }
  }, [order, open, defaultMarkup]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.taskName || !formData.clientId || !formData.printerId || !formData.filamentId) {
      toast.error("Заполните все обязательные поля");
      return;
    }

    const client = clients.find((c) => c.id === formData.clientId);
    const printer = printers.find((p) => p.id === formData.printerId);
    const filament = filaments.find((f) => f.id === formData.filamentId);

    if (!client || !printer || !filament) {
      toast.error("Выбранные данные не найдены");
      return;
    }

    const printTimeHours = parseFloat(formData.printTimeHours) || 0;
    const printTimeMinutes = parseFloat(formData.printTimeMinutes) || 0;
    const weight = parseFloat(formData.weight) || 0;
    const markup = parseFloat(formData.markup) || 0;

    const cost = calculateOrderCost({
      printerId: formData.printerId,
      filamentId: formData.filamentId,
      printTimeHours,
      printTimeMinutes,
      weight,
      markup,
    });

    const orderData = {
      taskName: formData.taskName,
      clientId: formData.clientId,
      clientName: client.name,
      printerId: formData.printerId,
      printerName: printer.name,
      filamentId: formData.filamentId,
      filamentName: filament.name,
      printTimeHours,
      printTimeMinutes,
      weight,
      markup,
      status: formData.status,
      cost,
      date: order?.date || new Date().toISOString().split("T")[0],
    };

    if (order) {
      onSave({ ...orderData, id: order.id });
    } else {
      onSave(orderData);
    }

    toast.success(order ? "Заказ обновлен" : "Заказ создан", {
      description: `Стоимость: ₽${cost.toFixed(2)}`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{order ? "Редактировать заказ" : "Создать заказ"}</DialogTitle>
          <DialogDescription>
            {order ? "Измените параметры заказа" : "Создайте новый заказ и рассчитайте стоимость"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="taskName">Название задания *</Label>
              <Input
                id="taskName"
                value={formData.taskName}
                onChange={(e) => setFormData({ ...formData, taskName: e.target.value })}
                placeholder="Деталь корпуса"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="clientId">Заказчик *</Label>
              <Select value={formData.clientId} onValueChange={(value) => setFormData({ ...formData, clientId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите клиента" />
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

            <div className="grid gap-2">
              <Label htmlFor="printerId">Принтер *</Label>
              <Select value={formData.printerId} onValueChange={(value) => setFormData({ ...formData, printerId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите принтер" />
                </SelectTrigger>
                <SelectContent>
                  {printers.map((printer) => (
                    <SelectItem key={printer.id} value={printer.id}>
                      {printer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="filamentId">Пластик *</Label>
              <Select value={formData.filamentId} onValueChange={(value) => setFormData({ ...formData, filamentId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите пластик" />
                </SelectTrigger>
                <SelectContent>
                  {filaments.map((filament) => (
                    <SelectItem key={filament.id} value={filament.id}>
                      {filament.name} ({filament.color}, {filament.weight}кг, ₽{filament.cost})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="hours">Время печати (часы)</Label>
                <Input
                  id="hours"
                  type="number"
                  min="0"
                  value={formData.printTimeHours}
                  onChange={(e) => setFormData({ ...formData, printTimeHours: e.target.value })}
                  placeholder="0"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="minutes">Время печати (минуты)</Label>
                <Input
                  id="minutes"
                  type="number"
                  min="0"
                  max="59"
                  value={formData.printTimeMinutes}
                  onChange={(e) => setFormData({ ...formData, printTimeMinutes: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="weight">Вес печати (г)</Label>
              <Input
                id="weight"
                type="number"
                min="0"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                placeholder="0"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="markup">Наценка (%)</Label>
              <Input
                id="markup"
                type="number"
                min="0"
                value={formData.markup}
                onChange={(e) => setFormData({ ...formData, markup: e.target.value })}
                placeholder="20"
              />
            </div>

            {order && (
              <div className="grid gap-2">
                <Label htmlFor="status">Статус</Label>
                <Select value={formData.status} onValueChange={(value: Order["status"]) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Новый</SelectItem>
                    <SelectItem value="in_progress">В работе</SelectItem>
                    <SelectItem value="completed">Завершен</SelectItem>
                    <SelectItem value="cancelled">Отменен</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit">{order ? "Сохранить" : "Создать"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
