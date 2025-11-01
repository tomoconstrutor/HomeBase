import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Car, Fuel, Wrench, FileText, Calendar, Edit2, Trash2, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AddCarDialog } from "./AddCarDialog";
import { EditCarDialog } from "./EditCarDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

interface CarItem {
  id: string;
  name: string;
  plate: string;
  owner: string;
  year?: string;
  color?: string;
  mileage?: string;
  nextService: string;
  nextInspection: string;
  fuelLevel: number;
}

interface CarsViewProps {
  onBack: () => void;
}

export function CarsView({ onBack }: CarsViewProps) {
  const [cars, setCars] = useState<CarItem[]>([
    {
      id: "1",
      name: "Toyota Corolla",
      plate: "AA-00-BB",
      owner: "Pai",
      year: "2020",
      color: "Preto",
      mileage: "50000",
      nextService: "2025-11-15",
      nextInspection: "2025-11-20",
      fuelLevel: 75
    },
    {
      id: "2",
      name: "Honda Civic",
      plate: "CC-11-DD",
      owner: "Mãe",
      year: "2019",
      color: "Branco",
      mileage: "65000",
      nextService: "2025-11-30",
      nextInspection: "2026-01-10",
      fuelLevel: 45
    }
  ]);

  const [editingCar, setEditingCar] = useState<CarItem | null>(null);
  const [deletingCarId, setDeletingCarId] = useState<string | null>(null);

  const addCar = (car: CarItem) => {
    setCars([...cars, car]);
  };

  const editCar = (updatedCar: CarItem) => {
    setCars(cars.map(car => car.id === updatedCar.id ? updatedCar : car));
  };

  const deleteCar = (id: string) => {
    setCars(cars.filter(car => car.id !== id));
    setDeletingCarId(null);
    toast({
      title: "Carro removido",
      description: "O carro foi removido com sucesso",
    });
  };

  const getDaysUntil = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDateStatus = (dateString: string) => {
    const days = getDaysUntil(dateString);
    if (days < 0) return "overdue";
    if (days <= 7) return "urgent";
    if (days <= 30) return "warning";
    return "ok";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "overdue": return "text-destructive";
      case "urgent": return "text-orange-500";
      case "warning": return "text-yellow-600";
      default: return "text-foreground";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "overdue": return <Badge variant="destructive" className="ml-2">Atrasado</Badge>;
      case "urgent": return <Badge className="ml-2 bg-orange-500">Urgente</Badge>;
      case "warning": return <Badge className="ml-2 bg-yellow-500">Em breve</Badge>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Gestão de Carros
          </h1>
          <p className="text-sm text-muted-foreground">
            Manutenção e documentos dos veículos
          </p>
        </div>
        <AddCarDialog onAddCar={addCar} />
      </div>

      {/* Cars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cars.map((car) => (
          <Card key={car.id} className="shadow-soft">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-primary text-white">
                    <Car className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{car.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{car.plate}</p>
                    {car.year && car.color && (
                      <p className="text-xs text-muted-foreground">{car.year} • {car.color}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{car.owner}</Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setEditingCar(car)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => setDeletingCarId(car.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Alerts */}
              {(getDateStatus(car.nextService) !== "ok" || getDateStatus(car.nextInspection) !== "ok" || car.fuelLevel < 25) && (
                <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    {getDateStatus(car.nextService) !== "ok" && (
                      <p className="text-destructive">Revisão {getDateStatus(car.nextService) === "overdue" ? "atrasada" : "próxima"}</p>
                    )}
                    {getDateStatus(car.nextInspection) !== "ok" && (
                      <p className="text-destructive">Inspeção {getDateStatus(car.nextInspection) === "overdue" ? "atrasada" : "próxima"}</p>
                    )}
                    {car.fuelLevel < 25 && (
                      <p className="text-destructive">Combustível baixo</p>
                    )}
                  </div>
                </div>
              )}

              {/* Mileage */}
              {car.mileage && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Quilometragem</span>
                  <span className="font-medium">{parseInt(car.mileage).toLocaleString("pt-PT")} km</span>
                </div>
              )}

              {/* Fuel Level */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Fuel className="h-4 w-4 text-primary" />
                    Combustível
                  </span>
                  <span className={`font-medium ${car.fuelLevel < 25 ? "text-destructive" : ""}`}>
                    {car.fuelLevel}%
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      car.fuelLevel < 25 ? "bg-destructive" : "bg-gradient-primary"
                    }`}
                    style={{ width: `${car.fuelLevel}%` }}
                  />
                </div>
              </div>

              {/* Next Service */}
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Wrench className="h-4 w-4" />
                  Próxima Revisão
                </span>
                <div className="flex items-center">
                  <span className={`font-medium ${getStatusColor(getDateStatus(car.nextService))}`}>
                    {new Date(car.nextService).toLocaleDateString("pt-PT")}
                  </span>
                  {getStatusBadge(getDateStatus(car.nextService))}
                </div>
              </div>

              {/* Next Inspection */}
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  Próxima Inspeção
                </span>
                <div className="flex items-center">
                  <span className={`font-medium ${getStatusColor(getDateStatus(car.nextInspection))}`}>
                    {new Date(car.nextInspection).toLocaleDateString("pt-PT")}
                  </span>
                  {getStatusBadge(getDateStatus(car.nextInspection))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Calendar className="h-4 w-4 mr-2" />
                  Agendar
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Ver Detalhes
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <EditCarDialog
        car={editingCar}
        open={!!editingCar}
        onOpenChange={(open) => !open && setEditingCar(null)}
        onEditCar={editCar}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingCarId} onOpenChange={(open) => !open && setDeletingCarId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este carro? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deletingCarId && deleteCar(deletingCarId)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
