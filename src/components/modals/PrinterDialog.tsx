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
import { Printer } from "@/types";
import { toast } from "sonner";

interface PrinterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  printer?: Printer;
  onSave: (printer: Omit<Printer, "id"> | Printer) => void;
}

export function PrinterDialog({ open, onOpenChange, printer, onSave }: PrinterDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    power: "",
    cost: "",
    depreciation: "5",
    totalHours: "0",
  });

  useEffect(() => {
    if (printer) {
      setFormData({
        name: printer.name,
        power: printer.power.toString(),
        cost: printer.cost.toString(),
        depreciation: printer.depreciation.toString(),
        totalHours: printer.totalHours.toString(),
      });
    } else {
      setFormData({
        name: "",
        power: "",
        cost: "",
        depreciation: "5",
        totalHours: "0",
      });
    }
  }, [printer, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.power || !formData.cost) {
      toast.error("Заполните все обязательные поля");
      return;
    }

    const printerData = {
      name: formData.name,
      power: parseFloat(formData.power),
      cost: parseFloat(formData.cost),
      depreciation: parseFloat(formData.depreciation),
      totalHours: parseFloat(formData.totalHours),
    };

    if (printer) {
      onSave({ ...printerData, id: printer.id });
    } else {
      onSave(printerData);
    }

    toast.success(printer ? "Принтер обновлен" : "Принтер добавлен");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{printer ? "Редактировать принтер" : "Добавить принтер"}</DialogTitle>
          <DialogDescription>
            {printer ? "Измените параметры принтера" : "Добавьте новый 3D-принтер"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Название *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Prusa i3 MK3S"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="power">Мощность (Вт) *</Label>
              <Input
                id="power"
                type="number"
                value={formData.power}
                onChange={(e) => setFormData({ ...formData, power: e.target.value })}
                placeholder="240"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cost">Стоимость (₽) *</Label>
              <Input
                id="cost"
                type="number"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                placeholder="45000"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="depreciation">Амортизация (% в год)</Label>
              <Input
                id="depreciation"
                type="number"
                value={formData.depreciation}
                onChange={(e) => setFormData({ ...formData, depreciation: e.target.value })}
                placeholder="5"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="totalHours">Наработано часов</Label>
              <Input
                id="totalHours"
                type="number"
                value={formData.totalHours}
                onChange={(e) => setFormData({ ...formData, totalHours: e.target.value })}
                placeholder="0"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit">{printer ? "Сохранить" : "Добавить"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
