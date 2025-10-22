import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Pencil, Plus, Trash2, Search } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { usePage } from "@/context/PageContext";
import { FilamentDialog } from "@/components/modals/FilamentDialog";
import { Filament } from "@/types";
import { toast } from "sonner";

const Filaments = () => {
  const { filaments, addFilament, updateFilament, deleteFilament } = useApp();
  const { setCurrentPageTitle } = usePage();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setCurrentPageTitle("Пластик");
  }, [setCurrentPageTitle]);
  const [selectedFilament, setSelectedFilament] = useState<Filament | undefined>();
  const [filamentToDelete, setFilamentToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFilaments = filaments.filter((filament) =>
    filament.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    filament.color?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (filament: Filament) => {
    setSelectedFilament(filament);
    setIsDialogOpen(true);
  };

  const handleDelete = (filamentId: string) => {
    setFilamentToDelete(filamentId);
  };

  const confirmDelete = () => {
    if (filamentToDelete) {
      deleteFilament(filamentToDelete);
      toast.success("Пластик удален");
      setFilamentToDelete(null);
    }
  };

  const handleSave = (filamentData: Omit<Filament, "id"> | Filament) => {
    if ("id" in filamentData) {
      const { id, ...data } = filamentData;
      updateFilament(id, data);
    } else {
      addFilament(filamentData);
    }
    setIsDialogOpen(false);
    setSelectedFilament(undefined);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <Button 
          className="shadow-md"
          onClick={() => {
            setSelectedFilament(undefined);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Добавить пластик
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Поиск по названию или цвету..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredFilaments.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            Пластик не найден
          </div>
        ) : (
          filteredFilaments.map((filament) => (
            <Card key={filament.id} className="p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{filament.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{filament.color}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleEdit(filament)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(filament.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Вес катушки:</span>
                    <span className="font-medium">{filament.weight} кг</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Стоимость:</span>
                    <span className="font-medium">₽{filament.cost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border">
                    <span className="text-muted-foreground">Наличие:</span>
                    <span className={`font-semibold ${filament.inStock ? "text-primary" : "text-destructive"}`}>
                      {filament.inStock ? "В наличии" : "Нет в наличии"}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <FilamentDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        filament={selectedFilament}
        onSave={handleSave}
      />

      <AlertDialog open={!!filamentToDelete} onOpenChange={() => setFilamentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить пластик?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Материал будет удален навсегда.
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

export default Filaments;
