// src/components/articles/Articles.tsx
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
  categoryId: number;
}

const Articles = () => {
  const [articles, setArticles] = useState<Article[]>([]); // Используем интерфейс Article для типизации массива

  useEffect(() => {
    fetchArticles();
  }, []);

  // Функция для загрузки статей
  const fetchArticles = async () => {
    try {
      const response = await axios.get<Article[]>('/api/articles');
      setArticles(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке статей:', error);
    }
  };

  // Функция для создания статьи
  const handleCreate = async (data: { title: string; content: string; categoryId: number }) => {
    try {
      await axios.post('/api/articles', data);
      fetchArticles();
    } catch (error) {
      console.error('Ошибка при создании статьи:', error);
    }
  };

  // Функция для редактирования статьи
  const handleEdit = (article: Article) => {
    // Логика для открытия формы с данными статьи
    // Можно передавать article в ArticleForm для редактирования
    console.log('Редактировать статью:', article);
  };

  // Функция для удаления статьи
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/articles/${id}`);
      fetchArticles();
    } catch (error) {
      console.error('Ошибка при удалении статьи:', error);
    }
  };

  return (
    <div className={styles.articlesContainer}>
      <ArticleForm onSubmit={handleCreate} />
      <ArticleList articles={articles} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default Articles;
