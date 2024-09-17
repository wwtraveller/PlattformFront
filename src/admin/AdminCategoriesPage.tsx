import CategoryManager from "admin/components/categories/CategoryManager";

// Заглушка для onCategorySelect
const handleCategorySelect = (categoryName: string) => {
  console.log("Выбрана категория:", categoryName);
};

// Заглушка для onCategoriesChange
const handleCategoriesChange = (categories: string[]) => {
  console.log("Изменился список категорий:", categories);
};

const AdminCategoriesPage = () => {
  return (
    <div>
      <h1>Админ-панель: Управление категориями</h1>
      <CategoryManager />
    </div>
  );
};

export default AdminCategoriesPage;
