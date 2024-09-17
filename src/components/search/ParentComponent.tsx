import React, { useState, useEffect } from "react";
import Search from "./Search"; // Путь к компоненту Search
import CategoryManager from "admin/componentsAdmin/categoriesAdmin/CategoryManager";
// Путь к компоненту CategoryManager

const ParentComponent = () => {
  const [categories, setCategories] = useState<string[]>([]); // Состояние для категорий

  // Эффект для загрузки начальных категорий (если необходимо)
  useEffect(() => {
    const initialCategories = ["Продукт", "Маркетинг", "Блог"]; // Пример данных
    setCategories(initialCategories);
  }, []);

  // Функция для обновления категорий из CategoryManager
  const handleCategoriesChange = (updatedCategories: string[]) => {
    setCategories(updatedCategories);
    console.log("Updated Categories in Parent:", updatedCategories); // Лог для проверки обновленных категорий
  };

  const handleCategorySelect = (categoryName: string) => {
    console.log("Selected Category:", categoryName); // Лог для проверки выбранной категории
  };

  return (
    <div>
      {/* Компонент для управления категориями */}
      {/*<CategoryManager 
        onCategorySelect={handleCategorySelect} 
        onCategoriesChange={handleCategoriesChange} 
      />*/}

      {/* Компонент поиска, в который передаются категории */}
      <Search
        categories={categories} // Передача категорий в компонент Search
        setError={() => {}} // Если setError не используется, можно передать пустую функцию
        setSearchResults={() => {}} // Аналогично, если setSearchResults не используется
      />
    </div>
  );
};

export default ParentComponent;
