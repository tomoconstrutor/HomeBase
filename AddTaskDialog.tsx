import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";

interface Task {
  id: string;
  name: string;
  description: string;
  category: string;
  assignedTo: string[];
  priority: "baixa" | "media" | "alta";
  dueDate?: string;
  points: number;
  completed: boolean;
  needsAttention: boolean;
  comments: number;
}

interface AddTaskDialogProps {
  category: string;
  onAddTask: (task: Omit<Task, 'id' | 'completed' | 'needsAttention' | 'comments'>) => void;
}

const familyMembers = ["Pai", "Mãe", "Filipa", "Inês", "Marta", "Tomás"];

export function AddTaskDialog({ category, onAddTask }: AddTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    assignedTo: [] as string[],
    priority: "media" as const,
    dueDate: "",
    points: 10
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.assignedTo.length > 0) {
      onAddTask({
        ...formData,
        category
      });
      setFormData({
        name: "",
        description: "",
        assignedTo: [],
        priority: "media",
        dueDate: "",
        points: 10
      });
      setOpen(false);
    }
  };

  const handleMemberToggle = (member: string) => {
    setFormData(prev => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(member)
        ? prev.assignedTo.filter(m => m !== member)
        : [...prev.assignedTo, member]
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary">
          <Plus className="h-4 w-4 mr-2" />
          Nova Tarefa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Tarefa - {category}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Tarefa</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Aspirar a sala..."
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detalhes sobre a tarefa..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Atribuir a</Label>
            <div className="grid grid-cols-2 gap-2">
              {familyMembers.map((member) => (
                <div key={member} className="flex items-center space-x-2">
                  <Checkbox
                    id={member}
                    checked={formData.assignedTo.includes(member)}
                    onCheckedChange={() => handleMemberToggle(member)}
                  />
                  <Label htmlFor={member} className="text-sm font-normal">
                    {member}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Prioridade</Label>
              <Select value={formData.priority} onValueChange={(value: any) => setFormData({ ...formData, priority: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="points">Pontos</Label>
              <Input
                id="points"
                type="number"
                min="1"
                max="100"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 10 })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Data Limite (opcional)</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Criar Tarefa
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}