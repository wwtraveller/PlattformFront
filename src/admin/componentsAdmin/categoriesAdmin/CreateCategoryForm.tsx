import Button from "components/button/Button";
import React, { useState } from "react";

interface CreateCategoryFormProps {
  onCancel: () => void;
  onCreate: (categoryName: string) => void; // Добавляем пропс для создания категории
}

const CreateCategoryForm = ({ onCancel, onCreate }: CreateCategoryFormProps) => {
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleCreate = async () => {
    try {
      // Логика для создания новой категории
      onCreate(newCategoryName); // Вызов функции для создания категории
      setNewCategoryName(""); // Очистка поля ввода
      onCancel(); // Закрытие модального окна
    } catch (error) {
      console.error("Ошибка при создании категории:", error);
    }
  };

  return (
    <div>
      <h2>Создать новую категорию</h2>
      <input
        type="text"
        value={newCategoryName}
        onChange={(e) => setNewCategoryName(e.target.value)}
      />
      <Button onClick={handleCreate} name="Создать" />
      <Button onClick={onCancel} name="Отмена" />
    </div>
  );
};

export default CreateCategoryForm;
