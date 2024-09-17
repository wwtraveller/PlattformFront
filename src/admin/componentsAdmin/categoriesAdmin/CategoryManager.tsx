import Button from 'components/button/Button';
import React, { useState, useEffect } from 'react';


interface Category {
  id: number;
  name: string;
}

const CategoryManager = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Загружаем категории при монтировании компонента
  useEffect(() => {
    fetchCategories();
  }, []);

  // Функция для загрузки категорий
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Ошибка загрузки категорий');
      const data = await response.json();
      setCategories(data);
      setLoading(false);
    } catch (error) {
      setError('Не удалось загрузить категории');
      setLoading(false);
    }
  };

  // Создание новой категории
  const handleCreate = async () => {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName }),
      });
      if (!response.ok) throw new Error('Ошибка создания категории');
      const newCategory = await response.json();
      setCategories([...categories, newCategory]);
      setShowEditModal(false);
    } catch (error) {
      console.error('Ошибка при создании категории', error);
    }
  };

  // Редактирование категории
  const handleSave = async () => {
    if (editingCategory) {
      try {
        const response = await fetch(`/api/categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newCategoryName }),
        });
        if (!response.ok) throw new Error('Ошибка обновления категории');
        const updatedCategory = await response.json();
        setCategories(
          categories.map((cat) =>
            cat.id === updatedCategory.id ? updatedCategory : cat
          )
        );
        setShowEditModal(false);
      } catch (error) {
        console.error('Ошибка при обновлении категории', error);
      }
    }
  };

  // Удаление категории
  const handleDelete = async () => {
    if (editingCategory) {
      try {
        const response = await fetch(`/api/categories/${editingCategory.id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Ошибка удаления категории');
        setCategories(categories.filter((cat) => cat.id !== editingCategory.id));
        setShowDeleteModal(false);
      } catch (error) {
        console.error('Ошибка при удалении категории', error);
      }
    }
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Управление категориями</h2>
      <Button onClick={() => { setShowEditModal(true); setEditingCategory(null); setNewCategoryName(''); }} name="Создать категорию" />
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            {category.name}
            <Button onClick={() => { setEditingCategory(category); setNewCategoryName(category.name); setShowEditModal(true); }} name="Редактировать" />
            <Button onClick={() => { setEditingCategory(category); setShowDeleteModal(true); }} name="Удалить" />
          </li>
        ))}
      </ul>

      {/* Модальное окно для создания/редактирования */}
      {showEditModal && (
        <div className="modal">
          <h2>{editingCategory ? 'Редактировать категорию' : 'Создать категорию'}</h2>
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <Button onClick={editingCategory ? handleSave : handleCreate} name="Сохранить" />
          <Button onClick={() => setShowEditModal(false)} name="Отмена" />
        </div>
      )}

      {/* Модальное окно для удаления */}
      {showDeleteModal && (
        <div className="modal">
          <h2>Удалить категорию "{editingCategory?.name}"?</h2>
          <Button onClick={handleDelete} name="Удалить" />
          <Button onClick={() => setShowDeleteModal(false)} name="Отмена" />
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
