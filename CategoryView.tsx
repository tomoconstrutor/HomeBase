import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { 
  ArrowLeft,
  Plus,
  Calendar,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare
} from "lucide-react";

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

const mockTasks: Task[] = [
  {
    id: "1",
    name: "Cortar a relva",
    description: "Cortar a relva da frente e traseira",
    category: "Exterior",
    dueDate: "2024-01-15",
    assignedTo: ["Pai"],
    priority: "media",
    points: 20,
    completed: false,
    needsAttention: false,
    comments: 0
  },
  {
    id: "2", 
    name: "Podar as plantas",
    description: "Podar as plantas do jardim",
    category: "Exterior",
    assignedTo: ["Mãe", "Filipa"],
    priority: "baixa",
    points: 15,
    completed: true,
    needsAttention: false,
    comments: 2
  },
  {
    id: "3",
    name: "Limpar a piscina",
    description: "Limpeza semanal da piscina",
    category: "Exterior",
    dueDate: "2024-01-12",
    assignedTo: ["Tomás"],
    priority: "alta",
    points: 25,
    completed: false,
    needsAttention: true,
    comments: 1
  }
];

const priorityColors = {
  baixa: "bg-green-100 text-green-800",
  media: "bg-yellow-100 text-yellow-800", 
  alta: "bg-red-100 text-red-800"
};

interface CategoryViewProps {
  categoryName: string;
  onBack: () => void;
}

export function CategoryView({ categoryName, onBack }: CategoryViewProps) {
  const [activeTab, setActiveTab] = useState("todas");
  const [tasks, setTasks] = useState(mockTasks);

  const addTask = (newTask: Omit<Task, 'id' | 'completed' | 'needsAttention' | 'comments'>) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      completed: false,
      needsAttention: false,
      comments: 0
    };
    setTasks(prev => [...prev, task]);
  };

  const assignRandomTask = () => {
    const pendingTasks = tasks.filter(task => !task.completed);
    if (pendingTasks.length === 0) return;
    
    const randomTask = pendingTasks[Math.floor(Math.random() * pendingTasks.length)];
    const familyMembers = ["Pai", "Mãe", "Filipa", "Inês", "Marta", "Tomás"];
    const randomMember = familyMembers[Math.floor(Math.random() * familyMembers.length)];
    
    setTasks(prev => prev.map(task => 
      task.id === randomTask.id 
        ? { ...task, assignedTo: [randomMember] }
        : task
    ));
  };

  const scheduleTask = () => {
    const unscheduledTasks = tasks.filter(task => !task.dueDate && !task.completed);
    if (unscheduledTasks.length > 0) {
      alert(`${unscheduledTasks.length} tarefas precisam de agendamento`);
    } else {
      alert("Todas as tarefas pendentes já estão agendadas");
    }
  };

  const toggleTaskComplete = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };
  
  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);
  const attentionTasks = tasks.filter(task => task.needsAttention);

  const getFilteredTasks = () => {
    switch (activeTab) {
      case "pendentes":
        return pendingTasks;
      case "concluidas":
        return completedTasks;
      case "atencao":
        return attentionTasks;
      default:
        return tasks;
    }
  };

  const TaskCard = ({ task }: { task: Task }) => (
    <Card className={`cursor-pointer hover:shadow-medium transition-all duration-200 ${
      task.completed ? 'bg-success/5 border-success/20' : 
      task.needsAttention ? 'bg-destructive/5 border-destructive/20' : ''
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className={`text-lg ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
              {task.name}
            </CardTitle>
            {task.description && (
              <p className="text-sm text-muted-foreground">{task.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {task.completed && <CheckCircle2 className="h-5 w-5 text-success" />}
            {task.needsAttention && <AlertCircle className="h-5 w-5 text-destructive" />}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge className={priorityColors[task.priority]} variant="secondary">
            {task.priority}
          </Badge>
          {task.assignedTo.map((person) => (
            <Badge key={person} variant="outline">
              <User className="h-3 w-3 mr-1" />
              {person}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            {task.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(task.dueDate).toLocaleDateString('pt-PT')}
              </div>
            )}
            {task.comments > 0 && (
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                {task.comments}
              </div>
            )}
          </div>
          <Button 
            variant={task.completed ? "outline" : "default"} 
            size="sm"
            onClick={() => toggleTaskComplete(task.id)}
          >
            {task.completed ? "Concluída" : "Marcar como Feita"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{categoryName}</h1>
          <p className="text-muted-foreground">
            {pendingTasks.length} tarefas pendentes • {completedTasks.length} concluídas
          </p>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="bg-gradient-card shadow-soft">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Progresso das Tarefas</span>
              <span className="font-medium">
                {completedTasks.length}/{tasks.length}
              </span>
            </div>
            <Progress 
              value={(completedTasks.length / tasks.length) * 100} 
              className="h-3" 
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap">
        <AddTaskDialog category={categoryName} onAddTask={addTask} />
        <Button 
          variant="outline"
          onClick={assignRandomTask}
        >
          <User className="h-4 w-4 mr-2" />
          Atribuir Aleatório
        </Button>
        <Button 
          variant="outline"
          onClick={scheduleTask}
        >
          <Clock className="h-4 w-4 mr-2" />
          Agendar
        </Button>
      </div>

      {/* Tasks Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="todas">Todas ({tasks.length})</TabsTrigger>
          <TabsTrigger value="pendentes">Pendentes ({pendingTasks.length})</TabsTrigger>
          <TabsTrigger value="concluidas">Concluídas ({completedTasks.length})</TabsTrigger>
          <TabsTrigger value="atencao">Atenção ({attentionTasks.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="todas" className="space-y-4">
          {getFilteredTasks().map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </TabsContent>

        <TabsContent value="pendentes" className="space-y-4">
          {getFilteredTasks().map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </TabsContent>

        <TabsContent value="concluidas" className="space-y-4">
          {getFilteredTasks().map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </TabsContent>

        <TabsContent value="atencao" className="space-y-4">
          {getFilteredTasks().map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </TabsContent>
      </Tabs>

      {getFilteredTasks().length === 0 && (
        <Card className="py-12">
          <CardContent className="text-center">
            <p className="text-muted-foreground">Nenhuma tarefa encontrada</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}