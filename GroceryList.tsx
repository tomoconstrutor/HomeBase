import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { AddItemDialog } from "@/components/AddItemDialog";
import { 
  ShoppingCart,
  Plus,
  ArrowLeft,
  Package,
  Sparkles,
  Coffee,
  Heart
} from "lucide-react";

interface GroceryItem {
  id: string;
  name: string;
  category: "comida" | "higiene" | "limpeza" | "outros";
  quantity: string;
  priority: "baixa" | "alta";
  bought: boolean;
  addedBy: string;
}

const mockGroceryItems: GroceryItem[] = [
  {
    id: "1",
    name: "Leite",
    category: "comida",
    quantity: "2 litros",
    priority: "alta",
    bought: false,
    addedBy: "Mãe"
  },
  {
    id: "2",
    name: "Pão",
    category: "comida", 
    quantity: "1 unidade",
    priority: "alta",
    bought: true,
    addedBy: "Pai"
  },
  {
    id: "3",
    name: "Detergente",
    category: "limpeza",
    quantity: "1 litro",
    priority: "baixa",
    bought: false,
    addedBy: "Filipa"
  },
  {
    id: "4",
    name: "Pasta de dentes",
    category: "higiene",
    quantity: "2 tubos",
    priority: "baixa",
    bought: false,
    addedBy: "Tomás"
  },
  {
    id: "5",
    name: "Maçãs",
    category: "comida",
    quantity: "1 kg",
    priority: "alta",
    bought: true,
    addedBy: "Marta"
  }
];

const categoryIcons = {
  comida: <Coffee className="h-4 w-4" />,
  higiene: <Heart className="h-4 w-4" />,
  limpeza: <Sparkles className="h-4 w-4" />,
  outros: <Package className="h-4 w-4" />
};

const categoryColors = {
  comida: "bg-orange-100 text-orange-800",
  higiene: "bg-blue-100 text-blue-800",
  limpeza: "bg-purple-100 text-purple-800",
  outros: "bg-gray-100 text-gray-800"
};

const priorityColors = {
  baixa: "bg-green-100 text-green-800",
  alta: "bg-red-100 text-red-800"
};

interface GroceryListProps {
  onBack: () => void;
}

export function GroceryList({ onBack }: GroceryListProps) {
  const [activeTab, setActiveTab] = useState("todos");
  const [items, setItems] = useState(mockGroceryItems);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const addItem = (newItem: Omit<GroceryItem, 'id' | 'bought'>) => {
    const item: GroceryItem = {
      ...newItem,
      id: Date.now().toString(),
      bought: false
    };
    setItems(prev => [...prev, item]);
  };

  const clearBoughtItems = () => {
    setItems(items.filter(item => !item.bought));
  };

  const toggleMultipleSelect = () => {
    if (selectedItems.length > 0) {
      // Mark selected items as bought
      setItems(items.map(item => 
        selectedItems.includes(item.id) ? { ...item, bought: true } : item
      ));
      setSelectedItems([]);
    }
  };

  const totalItems = items.length;
  const boughtItems = items.filter(item => item.bought).length;
  const pendingItems = items.filter(item => !item.bought);
  const highPriorityItems = items.filter(item => item.priority === "alta" && !item.bought);

  const getSortedItems = (itemsToSort: GroceryItem[]) => {
    return [...itemsToSort].sort((a, b) => {
      if (a.bought === b.bought) return 0;
      return a.bought ? 1 : -1; // Bought items go to the end
    });
  };

  const getFilteredItems = () => {
    let filtered;
    switch (activeTab) {
      case "pendentes":
        filtered = pendingItems;
        break;
      case "comprados":
        filtered = items.filter(item => item.bought);
        break;
      case "prioridade":
        filtered = highPriorityItems;
        break;
      default:
        filtered = items;
    }
    return getSortedItems(filtered);
  };

  const toggleItemBought = (itemId: string) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, bought: !item.bought } : item
    ));
  };

  const GroceryItemCard = ({ item }: { item: GroceryItem }) => {
    const isSelected = selectedItems.includes(item.id);
    
    return (
      <Card className={`transition-all duration-200 ${
        item.bought ? 'bg-success/5 border-success/20' : 'hover:shadow-soft'
      }`}>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <Checkbox 
              checked={item.bought || isSelected}
              onCheckedChange={(checked) => {
                if (item.bought) {
                  toggleItemBought(item.id);
                } else {
                  // Handle selection for multi-select
                  if (checked) {
                    setSelectedItems(prev => [...prev, item.id]);
                  } else {
                    setSelectedItems(prev => prev.filter(id => id !== item.id));
                  }
                }
              }}
              className="mt-1"
            />
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className={`font-medium ${item.bought ? 'line-through text-muted-foreground' : ''}`}>
                  {item.name}
                </h3>
                <div className="flex items-center gap-2">
                  {item.priority === "alta" && (
                    <Badge className={priorityColors[item.priority]} variant="secondary">
                      Prioridade Alta
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{item.quantity}</span>
                  <span>•</span>
                  <span>Por {item.addedBy}</span>
                </div>
                <Badge className={categoryColors[item.category]} variant="secondary">
                  {categoryIcons[item.category]}
                  <span className="ml-1 capitalize">{item.category}</span>
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 text-primary" />
            Lista de Compras
          </h1>
          <p className="text-muted-foreground">
            {pendingItems.length} itens pendentes • {boughtItems} comprados
          </p>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="bg-gradient-card shadow-soft">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Progresso das Compras</span>
              <span className="font-medium">
                {boughtItems}/{totalItems}
              </span>
            </div>
            <Progress 
              value={(boughtItems / totalItems) * 100} 
              className="h-3" 
            />
            <div className="text-center text-sm text-muted-foreground">
              {Math.round((boughtItems / totalItems) * 100)}% concluído
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: totalItems, color: "text-foreground" },
          { label: "Pendentes", value: pendingItems.length, color: "text-warning" },
          { label: "Comprados", value: boughtItems, color: "text-success" },
          { label: "Prioridade", value: highPriorityItems.length, color: "text-destructive" }
        ].map((stat) => (
          <Card key={stat.label} className="text-center">
            <CardContent className="pt-4">
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap">
        <AddItemDialog onAddItem={addItem} />
        <Button 
          variant="outline"
          onClick={toggleMultipleSelect}
          disabled={selectedItems.length === 0}
        >
          {selectedItems.length > 0 ? `Marcar ${selectedItems.length} itens` : "Marcar Múltiplos"}
        </Button>
        <Button 
          variant="outline"
          onClick={clearBoughtItems}
          disabled={boughtItems === 0}
        >
          Limpar Comprados
        </Button>
      </div>

      {/* Items Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="todos">Todos ({totalItems})</TabsTrigger>
          <TabsTrigger value="pendentes">Pendentes ({pendingItems.length})</TabsTrigger>
          <TabsTrigger value="comprados">Comprados ({boughtItems})</TabsTrigger>
          <TabsTrigger value="prioridade">Prioridade ({highPriorityItems.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="space-y-3">
          {getFilteredItems().map((item) => (
            <GroceryItemCard key={item.id} item={item} />
          ))}
        </TabsContent>

        <TabsContent value="pendentes" className="space-y-3">
          {getFilteredItems().map((item) => (
            <GroceryItemCard key={item.id} item={item} />
          ))}
        </TabsContent>

        <TabsContent value="comprados" className="space-y-3">
          {getFilteredItems().map((item) => (
            <GroceryItemCard key={item.id} item={item} />
          ))}
        </TabsContent>

        <TabsContent value="prioridade" className="space-y-3">
          {getFilteredItems().map((item) => (
            <GroceryItemCard key={item.id} item={item} />
          ))}
        </TabsContent>
      </Tabs>

      {getFilteredItems().length === 0 && (
        <Card className="py-12">
          <CardContent className="text-center">
            <p className="text-muted-foreground">Nenhum item encontrado</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}