import React, { useState } from 'react';
import Search from './Search';
import CategoryManager from 'components/categories/CategoryManager';


const ParentComponent = () => {
  const [categories, setCategories] = useState<string[]>([]);  // Состояние для категорий

  const handleCategoriesChange = (updatedCategories: string[]) => {
    setCategories(updatedCategories);  // Обновляем список категорий
  };

  return (
    <div>
     { /*<h1>Поиск и Управление Категориями</h1>*/}
      
      {/* Компонент поиска */}
      <Search 
        setError={(msg) => console.log(msg)} 
        setSearchResults={(results) => console.log(results)} 
        categories={categories}  // Передаем категории в компонент поиска
      />
      
      {/* Компонент управления категориями */}
      <CategoryManager 
        onCategoriesChange={handleCategoriesChange}  // Передаем функцию для обновления категорий
        onCategorySelect={(categoryName) => console.log(`Selected category: ${categoryName}`)} 
      />
    </div>
  );
};

export default ParentComponent;
