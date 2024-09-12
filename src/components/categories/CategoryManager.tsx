import React, { useEffect, useState } from 'react';
import Button from '../button/Button';
import categoryData from '../data/CategoriesData.json'

interface Category {
  id: number;
  name: string;
}

interface ModalProps {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({ show, onClose, children }: ModalProps) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        {children}
        <Button onClick={onClose} name="Закрыть" />
      </div>
    </div>
  );
};

interface CategoryProps {
    onCategorySelect: (categoryName: string) => void;
    onCategoriesChange: (categories: string[]) => void;
  }
  

const CategoryManager = ({ onCategorySelect, onCategoriesChange }: CategoryProps) => {
  const [categories, setCategories] = useState<Category[]>(categoryData);

  useEffect(() => {
    onCategoriesChange(categories.map(category => category.name)); // Передаем только названия категорий
  }, [categories, onCategoriesChange]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setShowEditModal(true);
  };

  const handleSave = () => {
    if (editingCategory) {
      setCategories(
        categories.map((cat) =>
          cat.id === editingCategory.id ? { ...cat, name: newCategoryName } : cat
        )
      );
    }
    setShowEditModal(false);
  };

  const handleDelete = (category: Category) => {
    setEditingCategory(category);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (editingCategory) {
      setCategories(categories.filter((cat) => cat.id !== editingCategory.id));
    }
    setShowDeleteModal(false);
  };
  const handleCategoryClick = (category: Category) => {
    onCategorySelect(category.name);  // Передаем название выбранной категории
  };
  console.log(categories);
  return (
    <div>
      <h2>Управление категориями</h2>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            {category.name}
            <Button
              onClick={() => handleEdit(category)}
              name="Редактировать"
            />
            <Button
              onClick={() => handleDelete(category)}
              name="Удалить"
            />
          </li>
        ))}
      </ul>

      {/* Модальное окно для редактирования категории */}
      <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
        <h2>Редактировать категорию</h2>
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <Button onClick={handleSave} name="Сохранить" />
      </Modal>

      {/* Модальное окно для подтверждения удаления */}
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <h2>Вы уверены, что хотите удалить категорию "{editingCategory?.name}"?</h2>
        <Button onClick={handleConfirmDelete} name="Удалить" />
      </Modal>
    </div>
  );
};

export default CategoryManager;
