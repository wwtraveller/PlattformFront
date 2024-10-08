import Button from "components/button/Button";
import React, { useState, useEffect } from "react";
import styles from "./categoryManager.module.css";
import Loader from "components/loader/Loader";

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
  const [newCategoryName, setNewCategoryName] = useState("");
  const [deleteCategoryPosition, setDeleteCategoryPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  // Загружаем категории при монтировании компонента
  useEffect(() => {
    fetchCategories();
  }, []);

  // Функция для загрузки категорий
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Ошибка загрузки категорий");
      const data = await response.json();
      setCategories(data);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2000); // Загрузчик будет виден 3 секунды

      // Очистка таймера
      return () => clearTimeout(timer);
    } catch (error) {
      setError("Не удалось загрузить категории");
      setLoading(false);
    }
  };

  // Создание новой категории
  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("accessToken"); // Получение токена
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Передача токена
        },
        body: JSON.stringify({ name: newCategoryName }),
      });
      if (!response.ok) throw new Error("Ошибка создания категории");
      const newCategory = await response.json();
      setCategories([...categories, newCategory]);
      setShowEditModal(false);
      setNewCategoryName(""); // Очистка имени новой категории
    } catch (error) {
      console.error("Ошибка при создании категории", error);
    }
  };

  // Редактирование категории
  const handleSave = async () => {
    if (editingCategory) {
      try {
        const token = localStorage.getItem("accessToken"); // Получение токена
        const response = await fetch(`/api/categories/${editingCategory.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Передача токена
          },
          body: JSON.stringify({ name: newCategoryName }),
        });
        if (!response.ok) throw new Error("Ошибка обновления категории");
        const updatedCategory = await response.json();
        setCategories(
          categories.map((cat) =>
            cat.id === updatedCategory.id ? updatedCategory : cat
          )
        );
        setShowEditModal(false);
        setNewCategoryName(""); // Очистка имени новой категории
      } catch (error) {
        console.error("Ошибка при обновлении категории", error);
      }
    }
  };

  // Удаление категории
  const handleDelete = async () => {
    if (editingCategory) {
      try {
        const token = localStorage.getItem("accessToken"); // Получение токена
        const response = await fetch(`/api/categories/${editingCategory.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`, // Передача токена
          },
        });
        if (!response.ok) throw new Error("Ошибка удаления категории");
        setCategories(
          categories.filter((cat) => cat.id !== editingCategory.id)
        );
        setShowDeleteModal(false);
        setEditingCategory(null); // Очистка редактируемой категории
      } catch (error) {
        console.error("Ошибка при удалении категории", error);
      }
    }
  };

  // Обработчик для показа модального окна удаления
  const handleShowDeleteModal =
    (category: Category) => (event: React.MouseEvent<HTMLButtonElement>) => {
      const rect = (
        event.currentTarget as HTMLButtonElement
      ).getBoundingClientRect();
      setDeleteCategoryPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left,
      });
      setEditingCategory(category);
      setShowDeleteModal(true);
    };

  if (loading)
    return (
      <div>
        <h1>Загрузка...</h1>
        <Loader />
      </div>
    );
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.div}>
      <h2 className={styles.h2}>Управление категориями</h2>
      <Button
        onClick={() => {
          setShowEditModal(true);
          setEditingCategory(null);
          setNewCategoryName("");
        }}
        name="Создать категорию"
      />
      <ul className={styles.ul}>
        {categories.map((category) => (
          <li className={styles.li} key={category.id}>
            {category.name}
            <div className={styles.buttonGroup}>
              <Button
                onClick={() => {
                  setEditingCategory(category);
                  setNewCategoryName(category.name);
                  setShowEditModal(true);
                }}
                name="Редактировать"
              />
              <Button
                onClick={handleShowDeleteModal(category)}
                name="Удалить"
              />
            </div>
          </li>
        ))}
      </ul>

      {/* Модальное окно для создания/редактирования */}
      {showEditModal && (
        <div className={styles.modal}>
          <h2>
            {editingCategory ? "Редактировать категорию" : "Создать категорию"}
          </h2>
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <Button
            className={styles.button}
            onClick={editingCategory ? handleSave : handleCreate}
            name="Сохранить"
          />
          <Button
            className={styles.button}
            onClick={() => setShowEditModal(false)}
            name="Отмена"
          />
        </div>
      )}

      {/* Модальное окно для удаления */}
      {showDeleteModal && deleteCategoryPosition && (
        <div
          className={styles.modalDelete}
          style={{
            position: "absolute",
            top: deleteCategoryPosition.top + "px",
            left: deleteCategoryPosition.left + "px",
            transform: "translateY(10px)",
            zIndex: 1000,
          }}
        >
          <h4>Удалить категорию и все статьи с "{editingCategory?.name}"?</h4>
          <Button
            className={styles.button}
            onClick={handleDelete}
            name="Удалить"
          />
          <Button
            className={styles.button}
            onClick={() => setShowDeleteModal(false)}
            name="Отмена"
          />
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
