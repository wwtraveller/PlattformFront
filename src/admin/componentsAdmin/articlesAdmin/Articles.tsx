import { useState, useEffect } from 'react';
import axios from 'axios';
import ArticleForm from './ArticleForm'; // Проверьте правильность пути
import ArticleList from './ArticleList'; // Проверьте правильность пути
import styles from './articles.module.css';

interface Article {
  id: number;
  title: string;
  content: string;
  category: { id: number; name: string } | null;
}

interface Category {
  id: number;
  name: string;
}

export default function Articles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

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

  const handleCreateArticle = async (data: { title: string; content: string; categoryId: number }) => {
    try {
      await axios.post('/api/articles', data);
      fetchArticles(); // Обновляем список статей после создания новой
    } catch (error) {
      console.error('Ошибка при создании статьи:', error);
    }
  };

  const handleEditArticle = (article: Article) => {
    console.log('Редактировать статью:', article);
    // Логика редактирования статьи
  };

  const handleDeleteArticle = async (id: number) => {
    try {
      await axios.delete(`/api/articles/${id}`);
      fetchArticles(); // Обновляем список статей после удаления
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
      />
    </div>
  );
}
