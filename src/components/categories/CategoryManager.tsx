import React, { useEffect, useState } from 'react';
import Button from '../button/Button';
import categoryData from '../data/CategoriesData.json'
import axios from 'axios';

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
    <div className="modalBackdrop">
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');

useEffect(() => {
    onCategoriesChange(categories.map(category => category.name)); // Передаем только названия категорий
  }, [categories, onCategoriesChange]);

  useEffect(() => {
    // Функция для загрузки категорий из API
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке категорий', error);
      }
    };

    fetchCategories();
  }, []);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setShowEditModal(true);
  };

  const handleSave = async () => {
    if (editingCategory) {
      try {
        await axios.put(`/api/categories/${editingCategory.id}`, { name: newCategoryName });  //!изменить ентпоинт
        setCategories(
          categories.map((cat) =>
            cat.id === editingCategory.id ? { ...cat, name: newCategoryName } : cat
          )
        );
      } catch (error) {
        console.error('Ошибка при сохранении категории', error);
      }
    }
    setShowEditModal(false);
  };


  const handleDelete = (category: Category) => {
    setEditingCategory(category);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (editingCategory) {
      try {
        await axios.delete(`/api/categories/${editingCategory.id}`);
        setCategories(categories.filter((cat) => cat.id !== editingCategory.id));
      } catch (error) {
        console.error('Ошибка при удалении категории', error);
      }
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
