import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Plus, Trash2, Search } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { usePage } from "@/context/PageContext";
import { PrinterDialog } from "@/components/modals/PrinterDialog";
import { Printer } from "@/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const Printers = () => {
  const { printers, addPrinter, updatePrinter, deletePrinter } = useApp();
  const { setCurrentPageTitle } = usePage();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    setCurrentPageTitle("Принтеры");
  }, [setCurrentPageTitle]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPrinter, setSelectedPrinter] = useState<Printer | undefined>();
  const [printerToDelete, setPrinterToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPrinters = printers.filter((printer) =>
    printer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (printer: Printer) => {
    setSelectedPrinter(printer);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setPrinterToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (printerToDelete) {
      deletePrinter(printerToDelete);
      toast.success("Принтер удален");
      setPrinterToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleSave = (printer: Omit<Printer, "id"> | Printer) => {
    if ("id" in printer) {
      const { id, ...data } = printer;
      updatePrinter(id, data);
    } else {
      addPrinter(printer);
    }
    setDialogOpen(false);
    setSelectedPrinter(undefined);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <Button
          className="shadow-md"
          onClick={() => {
            setSelectedPrinter(undefined);
            setDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Добавить принтер
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Поиск принтеров..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPrinters.map((printer) => (
          <Card key={printer.id} className="p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">{printer.name}</h3>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEdit(printer)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(printer.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Мощность:</span>
                  <span className="font-medium">{printer.power} Вт</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Стоимость:</span>
                  <span className="font-medium">₽{printer.cost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Амортизация:</span>
                  <span className="font-medium">{printer.depreciation}%</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="text-muted-foreground">Наработано:</span>
                  <span className="font-semibold text-primary">{printer.totalHours} ч</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredPrinters.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Принтеры не найдены</p>
        </div>
      )}

      <PrinterDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        printer={selectedPrinter}
        onSave={handleSave}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить принтер?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Принтер будет удален из системы.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Удалить</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Printers;
