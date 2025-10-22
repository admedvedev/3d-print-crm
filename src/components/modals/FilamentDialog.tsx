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
import { Switch } from "@/components/ui/switch";
import { Filament } from "@/types";
import { toast } from "sonner";

interface FilamentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filament?: Filament;
  onSave: (filament: Omit<Filament, "id"> | Filament) => void;
}

export function FilamentDialog({ open, onOpenChange, filament, onSave }: FilamentDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    weight: "1.0",
    cost: "",
    color: "",
    inStock: true,
  });

  useEffect(() => {
    if (filament) {
      setFormData({
        name: filament.name,
        weight: filament.weight.toString(),
        cost: filament.cost.toString(),
        color: filament.color,
        inStock: filament.inStock,
      });
    } else {
      setFormData({
        name: "",
        weight: "1.0",
        cost: "",
        color: "",
        inStock: true,
      });
    }
  }, [filament, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.weight || !formData.cost || !formData.color) {
      toast.error("Заполните все обязательные поля");
      return;
    }

    const filamentData = {
      name: formData.name,
      weight: parseFloat(formData.weight),
      cost: parseFloat(formData.cost),
      color: formData.color,
      inStock: formData.inStock,
    };

    if (filament) {
      onSave({ ...filamentData, id: filament.id });
    } else {
      onSave(filamentData);
    }

    toast.success(filament ? "Пластик обновлен" : "Пластик добавлен");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{filament ? "Редактировать пластик" : "Добавить пластик"}</DialogTitle>
          <DialogDescription>
            {filament ? "Измените параметры пластика" : "Добавьте новый материал для печати"}
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
                placeholder="PLA Базовый"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="color">Цвет *</Label>
              <Input
                id="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="Белый"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="weight">Вес катушки (кг) *</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                placeholder="1.0"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cost">Стоимость (₽) *</Label>
              <Input
                id="cost"
                type="number"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                placeholder="1200"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="inStock">В наличии</Label>
              <Switch
                id="inStock"
                checked={formData.inStock}
                onCheckedChange={(checked) => setFormData({ ...formData, inStock: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit">{filament ? "Сохранить" : "Добавить"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
