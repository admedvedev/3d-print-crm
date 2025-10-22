import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AdminPanel } from "@/components/AdminPanel";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { usePage } from "@/context/PageContext";
import { useAuth } from "@/context/AuthContext";

const Settings = () => {
  const { electricityRate, currency, defaultMarkup, updateSettings, resetToInitialState } = useApp();
  const { setCurrentPageTitle } = usePage();
  const { user } = useAuth();

  useEffect(() => {
    setCurrentPageTitle("Настройки");
  }, [setCurrentPageTitle]);
  
  const [localSettings, setLocalSettings] = useState({
    electricityRate: electricityRate.toString(),
    currency: currency,
    defaultMarkup: defaultMarkup.toString(),
  });
  
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    setLocalSettings({
      electricityRate: electricityRate.toString(),
      currency: currency,
      defaultMarkup: defaultMarkup.toString(),
    });
  }, [electricityRate, currency, defaultMarkup]);

  const handleSave = () => {
    updateSettings({
      electricityRate: parseFloat(localSettings.electricityRate),
      currency: localSettings.currency,
      defaultMarkup: parseFloat(localSettings.defaultMarkup),
    });
    toast.success("Настройки сохранены");
  };

  const handleResetAllData = () => {
    resetToInitialState();
    setConfirmDelete(false); // Сбрасываем чекбокс
    toast.success("Все данные сброшены к начальному состоянию");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">

      <Card className="p-6 shadow-lg space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Параметры расчета</h3>
          
          <div className="space-y-2">
            <Label htmlFor="electricityRate">Тариф на электроэнергию (₽/кВт·ч)</Label>
            <Input
              id="electricityRate"
              type="number"
              step="0.1"
              value={localSettings.electricityRate}
              onChange={(e) => setLocalSettings({ ...localSettings, electricityRate: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Валюта</Label>
            <Select value={localSettings.currency} onValueChange={(value) => setLocalSettings({ ...localSettings, currency: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="₽">Российский рубль (₽)</SelectItem>
                <SelectItem value="$">Доллар США ($)</SelectItem>
                <SelectItem value="€">Евро (€)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="defaultMarkup">Наценка по умолчанию (%)</Label>
            <Input
              id="defaultMarkup"
              type="number"
              min="0"
              value={localSettings.defaultMarkup}
              onChange={(e) => setLocalSettings({ ...localSettings, defaultMarkup: e.target.value })}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button onClick={handleSave} className="flex-1 shadow-md">
            Сохранить настройки
          </Button>
          <Button 
            variant="outline"
            onClick={() => {
              updateSettings({
                electricityRate: 5.5,
                currency: "₽",
                defaultMarkup: 20,
              });
            }}
          >
            Сбросить настройки
          </Button>
        </div>
      </Card>

      <div className="flex justify-end">
        <AlertDialog onOpenChange={(open) => {
          if (!open) {
            setConfirmDelete(false); // Сбрасываем чекбокс при закрытии диалога
          }
        }}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              Сбросить все данные
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-red-600">⚠️ Опасная операция</AlertDialogTitle>
              <AlertDialogDescription className="space-y-3">
                <p>
                  Это действие <strong>безвозвратно удалит</strong> всех принтеров, пластики, клиентов и заказы, 
                  которые вы добавили. Это действие нельзя отменить.
                </p>
                <p className="text-sm text-muted-foreground">
                  Будут сохранены только базовые настройки (тариф электроэнергии, валюта, наценка).
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col gap-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="confirm-delete"
                  checked={confirmDelete}
                  onChange={(e) => setConfirmDelete(e.target.checked)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="confirm-delete" className="text-sm font-medium text-foreground">
                  Я подтверждаю удаление всех данных
                </label>
              </div>
              <div className="flex gap-2 w-full">
                <AlertDialogCancel className="flex-1">Отмена</AlertDialogCancel>
                <Button
                  variant="destructive"
                  className="flex-1"
                  disabled={!confirmDelete}
                  onClick={handleResetAllData}
                >
                  Удалить все данные
                </Button>
              </div>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Панель администратора - показываем только для админа */}
      {user?.email === "andybear@3dcrm.com" && (
        <AdminPanel />
      )}
    </div>
  );
};

export default Settings;
