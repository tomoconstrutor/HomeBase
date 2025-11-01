import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CarFormData {
  name: string;
  plate: string;
  owner: string;
  year: string;
  color: string;
  mileage: string;
  nextService: string;
  nextInspection: string;
  fuelLevel: number;
}

interface AddCarDialogProps {
  onAddCar: (car: Omit<CarFormData, "fuelLevel"> & { fuelLevel: number; id: string }) => void;
}

export function AddCarDialog({ onAddCar }: AddCarDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<CarFormData>({
    name: "",
    plate: "",
    owner: "",
    year: "",
    color: "",
    mileage: "",
    nextService: "",
    nextInspection: "",
    fuelLevel: 100,
  });

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

    onAddCar({
      ...formData,
      id: Date.now().toString(),
    });

    toast({
      title: "Sucesso",
      description: "Carro adicionado com sucesso",
    });

    setFormData({
      name: "",
      plate: "",
      owner: "",
      year: "",
      color: "",
      mileage: "",
      nextService: "",
      nextInspection: "",
      fuelLevel: 100,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Carro
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Carro</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Carro *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Toyota Corolla"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="plate">Matrícula *</Label>
            <Input
              id="plate"
              value={formData.plate}
              onChange={(e) => setFormData({ ...formData, plate: e.target.value })}
              placeholder="Ex: AA-00-BB"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="owner">Proprietário *</Label>
            <Input
              id="owner"
              value={formData.owner}
              onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
              placeholder="Ex: Pai"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Ano</Label>
              <Input
                id="year"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                placeholder="Ex: 2020"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Cor</Label>
              <Input
                id="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="Ex: Preto"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mileage">Quilometragem</Label>
            <Input
              id="mileage"
              value={formData.mileage}
              onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
              placeholder="Ex: 50000"
              type="number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nextService">Próxima Revisão</Label>
            <Input
              id="nextService"
              type="date"
              value={formData.nextService}
              onChange={(e) => setFormData({ ...formData, nextService: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nextInspection">Próxima Inspeção</Label>
            <Input
              id="nextInspection"
              type="date"
              value={formData.nextInspection}
              onChange={(e) => setFormData({ ...formData, nextInspection: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fuelLevel">Nível de Combustível (%)</Label>
            <Input
              id="fuelLevel"
              type="number"
              min="0"
              max="100"
              value={formData.fuelLevel}
              onChange={(e) => setFormData({ ...formData, fuelLevel: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Adicionar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
