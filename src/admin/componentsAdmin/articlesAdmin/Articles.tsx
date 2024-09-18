import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ArticleForm from './ArticleForm';
import ArticleList from './ArticleList';
import styles from './articles.module.css';

// Определяем интерфейс для статьи
interface Article {
  id: number;
  title: string;
  content: string;
  category: { id: number; name: string };
}

interface Category {
  id: number;
  name: string;
}

const Articles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  // Функция для загрузки статей
  const fetchArticles = async () => {
    try {
      const response = await axios.get('/api/articles');
      setArticles(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке статей:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке категорий:', error);
    }
  };

  // Функция для создания статьи
  const handleCreateArticle = async (data: { title: string; content: string; categoryId: number }) => {
    try {
      await axios.post('/api/articles', data);
      fetchArticles();
    } catch (error) {
      console.error('Ошибка при создании статьи:', error);
    }
  };

  // Функция для редактирования статьи
  const handleEditArticle = (article: Article) => {
    setIsEditing(true);
    setEditingArticle(article);
  };

  // Функция для удаления статьи
  const handleDeleteArticle = async (id: number) => {
    try {
      await axios.delete(`/api/articles/${id}`);
      fetchArticles();
    } catch (error) {
      console.error('Ошибка при удалении статьи:', error);
    }
  };

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, []);

  return (
    <div className={styles.articlesContainer}>
      <h2>Управление статьями</h2>
      <ArticleForm onSubmit={handleCreateArticle} categories={categories} />
      <ArticleList
        articles={articles}
        onEdit={handleEditArticle}
        onDelete={handleDeleteArticle}
        fetchArticles={fetchArticles}
      />
    </div>
  );
};

export default Articles;
