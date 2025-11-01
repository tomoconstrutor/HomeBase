import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface EditCarDialogProps {
  car: CarItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditCar: (car: CarItem) => void;
}

export function EditCarDialog({ car, open, onOpenChange, onEditCar }: EditCarDialogProps) {
  const [formData, setFormData] = useState<CarItem | null>(null);

  useEffect(() => {
    if (car) {
      setFormData(car);
    }
  }, [car]);

  if (!formData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.plate || !formData.owner) {
      toast({
        title: "Erro",
        description: "Por favor preencha os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    onEditCar(formData);

    toast({
      title: "Sucesso",
      description: "Carro atualizado com sucesso",
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Carro</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Nome do Carro *</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Toyota Corolla"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-plate">Matrícula *</Label>
            <Input
              id="edit-plate"
              value={formData.plate}
              onChange={(e) => setFormData({ ...formData, plate: e.target.value })}
              placeholder="Ex: AA-00-BB"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-owner">Proprietário *</Label>
            <Input
              id="edit-owner"
              value={formData.owner}
              onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
              placeholder="Ex: Pai"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-year">Ano</Label>
              <Input
                id="edit-year"
                value={formData.year || ""}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                placeholder="Ex: 2020"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-color">Cor</Label>
              <Input
                id="edit-color"
                value={formData.color || ""}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="Ex: Preto"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-mileage">Quilometragem</Label>
            <Input
              id="edit-mileage"
              value={formData.mileage || ""}
              onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
              placeholder="Ex: 50000"
              type="number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-nextService">Próxima Revisão</Label>
            <Input
              id="edit-nextService"
              type="date"
              value={formData.nextService}
              onChange={(e) => setFormData({ ...formData, nextService: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-nextInspection">Próxima Inspeção</Label>
            <Input
              id="edit-nextInspection"
              type="date"
              value={formData.nextInspection}
              onChange={(e) => setFormData({ ...formData, nextInspection: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-fuelLevel">Nível de Combustível (%)</Label>
            <Input
              id="edit-fuelLevel"
              type="number"
              min="0"
              max="100"
              value={formData.fuelLevel}
              onChange={(e) => setFormData({ ...formData, fuelLevel: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
