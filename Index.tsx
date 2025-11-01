import { useState } from "react";
import { Dashboard } from "@/components/Dashboard";
import { CategoryView } from "@/components/CategoryView";
import { GroceryList } from "@/components/GroceryList";
import { CarsView } from "@/components/CarsView";

type View = "dashboard" | "category" | "grocery" | "cars";

const Index = () => {
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setCurrentView("category");
  };

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
    setSelectedCategory("");
  };

  const handleGroceryListClick = () => {
    setCurrentView("grocery");
  };

  const handleCarsClick = () => {
    setCurrentView("cars");
  };

  if (currentView === "category") {
    return (
      <CategoryView 
        categoryName={selectedCategory}
        onBack={handleBackToDashboard}
      />
    );
  }

  if (currentView === "grocery") {
    return (
      <GroceryList onBack={handleBackToDashboard} />
    );
  }

  if (currentView === "cars") {
    return (
      <CarsView onBack={handleBackToDashboard} />
    );
  }

  return (
    <Dashboard 
      onCategoryClick={handleCategoryClick}
      onGroceryClick={handleGroceryListClick}
      onCarsClick={handleCarsClick}
    />
  );
};

export default Index;
