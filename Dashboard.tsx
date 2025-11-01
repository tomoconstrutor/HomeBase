import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AddCategoryDialog } from "@/components/AddCategoryDialog";
import { 
  Home, 
  Trees, 
  ChefHat, 
  Car, 
  Sparkles, 
  ShoppingCart, 
  CheckCircle2, 
  Trophy,
  Plus
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon: any;
  description: string;
  taskCount: number;
  completedCount: number;
}

interface DashboardProps {
  onCategoryClick: (categoryName: string) => void;
  onGroceryClick: () => void;
  onCarsClick: () => void;
}

export function Dashboard({ onCategoryClick, onGroceryClick, onCarsClick }: DashboardProps) {
  const [categories, setCategories] = useState([
    {
      id: "1",
      name: "Exterior",
      icon: Trees,
      description: "Jardim, garagem e áreas externas",
      taskCount: 8,
      completedCount: 3
    },
    {
      id: "2", 
      name: "Interior",
      icon: Home,
      description: "Salas, quartos e áreas internas",
      taskCount: 12,
      completedCount: 8
    },
    {
      id: "3",
      name: "Cozinha",
      icon: ChefHat,
      description: "Cozinha e área de refeições",
      taskCount: 6,
      completedCount: 4
    },
    {
      id: "4",
      name: "Garagem",
      icon: Car,
      description: "Garagem e arrumos",
      taskCount: 4,
      completedCount: 1
    },
    {
      id: "5",
      name: "Limpeza",
      icon: Sparkles,
      description: "Tarefas gerais de limpeza",
      taskCount: 10,
      completedCount: 7
    }
  ]);

  const addCategory = (newCategory: Omit<Category, 'id' | 'taskCount' | 'completedCount'>) => {
    const category: Category = {
      ...newCategory,
      id: Date.now().toString(),
      taskCount: 0,
      completedCount: 0
    };
    setCategories(prev => [...prev, category]);
  };

  const showHistory = () => {
    alert("Histórico de tarefas concluídas - Em desenvolvimento");
  };

  const totalTasks = categories.reduce((sum, cat) => sum + cat.taskCount, 0);
  const completedTasks = categories.reduce((sum, cat) => sum + cat.completedCount, 0);
  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const groceryItems = {
    total: 12,
    bought: 8
  };

  const familyMembers = [
    { name: "Pai", points: 95, avatar: "P" },
    { name: "Mãe", points: 88, avatar: "M" },
    { name: "Filipa", points: 72, avatar: "F" },
    { name: "Inês", points: 68, avatar: "I" },
    { name: "Marta", points: 63, avatar: "M" },
    { name: "Tomás", points: 45, avatar: "T" }
  ];

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Gestão Familiar
        </h1>
        <p className="text-muted-foreground">
          Organize a sua casa em família
        </p>
      </div>

      {/* Overall Progress */}
      <Card className="bg-gradient-card shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Progresso Geral
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Tarefas Concluídas</span>
              <span className="font-medium">{completedTasks}/{totalTasks}</span>
            </div>
            <Progress value={completionPercentage} className="h-3" />
            <div className="text-center text-sm text-muted-foreground">
              {Math.round(completionPercentage)}% concluído
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Áreas da Casa</h2>
          <AddCategoryDialog onAddCategory={addCategory} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const progress = category.taskCount > 0 ? (category.completedCount / category.taskCount) * 100 : 0;
            const IconComponent = category.icon;
            
            return (
              <Card 
                key={category.id} 
                className="cursor-pointer hover:shadow-medium transition-all duration-200 hover:scale-105"
                onClick={() => onCategoryClick(category.name)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-primary text-white">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {category.completedCount}/{category.taskCount} tarefas
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress value={progress} className="h-2" />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Actions Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Grocery List */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              Lista de Compras
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Itens Comprados</span>
                <span className="font-medium">{groceryItems.bought}/{groceryItems.total}</span>
              </div>
              <Progress 
                value={(groceryItems.bought / groceryItems.total) * 100} 
                className="h-2"
              />
              <Button variant="outline" className="w-full" size="sm" onClick={onGroceryClick}>
                Ver Lista Completa
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Completed Tasks */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              Tarefas Concluídas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-2xl font-bold text-success">
                {completedTasks}
              </div>
              <p className="text-sm text-muted-foreground">
                Tarefas concluídas hoje
              </p>
              <Button 
                variant="outline" 
                className="w-full" 
                size="sm"
                onClick={showHistory}
              >
                Ver Histórico
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Cars */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5 text-primary" />
              Carros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Gestão de manutenção e documentos dos carros da família
              </p>
              <Button 
                variant="outline" 
                className="w-full" 
                size="sm"
                onClick={onCarsClick}
              >
                Ver Carros
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-warning" />
            Classificação Familiar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {familyMembers.map((member, index) => (
              <div key={member.name} className="flex items-center gap-3">
                <div className="flex items-center gap-2 min-w-[50px]">
                  <span className="text-lg font-bold text-muted-foreground">
                    #{index + 1}
                  </span>
                  {index === 0 && <Trophy className="h-4 w-4 text-warning" />}
                </div>
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                  {member.avatar}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{member.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary">{member.points}</div>
                  <div className="text-xs text-muted-foreground">pontos</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}