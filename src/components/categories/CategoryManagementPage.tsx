import { useState } from "react";
import CategoryManager from "./CategoryManager";
import CreateCategoryForm from "./CreateCategoryForm";

const CategoryManagementPage = () => {
    const [isCreating, setIsCreating] = useState(false);
    const [categories, setCategories] = useState<string[]>([
      'Продукт',
      'Маркетинг',
      'Блог',
    ]);
  
    const handleCreateNewCategory = () => {
      setIsCreating(true);
    };
  
    const handleCategoriesChange = (newCategories: string[]) => {
      setCategories(newCategories);
    };
  
    const handleCategorySelect = (categories: string) => {
      console.log('Выбрана категория:', categories);
    };
  
    const handleCancelCreation = () => {
      setIsCreating(false);
    };
  
    return (
      <div>
        <h1>Управление категориями</h1>
        <button onClick={handleCreateNewCategory}>Создать новую категорию</button>
        {isCreating && <CreateCategoryForm onCancel={handleCancelCreation} />}
        <CategoryManager
          onCategorySelect={handleCategorySelect}
          onCategoriesChange={handleCategoriesChange}
        />
      </div>
    );
  };
  
  export default CategoryManagementPage;