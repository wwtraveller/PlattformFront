import Button from "components/button/Button";
import React, { useState } from "react";


interface CreateCategoryFormProps {
  onCancel: () => void;
}

const CreateCategoryForm = ({ onCancel }: CreateCategoryFormProps) => {
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleCreate = () => {
    // Логика для создания новой категории
    console.log("Создать категорию:", newCategoryName);
    // Добавьте код для обновления состояния категорий в вашем бэкенде или родительском компоненте
    onCancel();
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
