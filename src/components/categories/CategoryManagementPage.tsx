import { useState } from "react";
import CategoryManager from "./CategoryManager";
import CreateCategoryForm from "./CreateCategoryForm";
import Button from "components/button/Button";

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
        <Button onClick={handleCreateNewCategory} name="Создать новую категорию" />
        {isCreating && <CreateCategoryForm onCancel={handleCancelCreation} />}
        <CategoryManager
          onCategorySelect={handleCategorySelect}
          onCategoriesChange={handleCategoriesChange}
        />
      </div>
    );
  };
  
  export default CategoryManagementPage;