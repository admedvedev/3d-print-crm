import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Trash2, Users, Database } from "lucide-react";

export function AdminPanel() {
  const [isClearing, setIsClearing] = useState(false);

  const clearAllUsers = async () => {
    try {
      setIsClearing(true);
      
      // Очищаем localStorage
      localStorage.clear();
      
      // Перезагружаем страницу для сброса состояния
      window.location.reload();
      
      toast.success("Все пользователи удалены. Страница будет перезагружена.");
    } catch (error) {
      console.error('Ошибка очистки:', error);
      toast.error("Произошла ошибка при очистке данных");
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <Card className="p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <Database className="h-6 w-6 text-destructive" />
        <h3 className="text-lg font-semibold text-destructive">Панель администратора</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        Осторожно! Эти действия необратимы и удалят все данные пользователей.
      </p>

      <div className="space-y-3">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full" disabled={isClearing}>
              <Trash2 className="mr-2 h-4 w-4" />
              Очистить всех пользователей
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-destructive">⚠️ Опасная операция</AlertDialogTitle>
              <AlertDialogDescription className="space-y-3">
                <p>
                  Это действие <strong>безвозвратно удалит</strong> всех пользователей и их данные:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Все аккаунты пользователей</li>
                  <li>Все принтеры, пластики, клиенты</li>
                  <li>Все заказы и настройки</li>
                  <li>Все данные в localStorage</li>
                </ul>
                <p className="text-sm font-medium text-destructive">
                  Это действие нельзя отменить!
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction 
                onClick={clearAllUsers}
                className="bg-destructive hover:bg-destructive/90"
                disabled={isClearing}
              >
                {isClearing ? "Удаление..." : "Удалить все данные"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="p-3 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>Примечание:</strong> После очистки база данных вернется к исходному состоянию 
            с одним тестовым аккаунтом (admin@example.com / admin123).
          </p>
        </div>
      </div>
    </Card>
  );
}
