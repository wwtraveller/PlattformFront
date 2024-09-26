import { useState, useEffect } from 'react';
import axios from 'axios';
import ArticleForm from './ArticleForm'; 
import ArticleList from './ArticleList'; 
import styles from './articles.module.css';
import Button from 'components/button/Button';

interface Article {
  id: number;
  title: string;
  content: string;
  categoryId: number;
  category: { id: number; name: string } | null;
}

interface Category {
  id: number;
  name: string;
}

export default function Articles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [showEditModal, setShowEditModal] = useState(false);
  // const [showDeleteModal, setShowDeleteModal] = useState(false);
  // const [editingArticle, setEditingArticle] = useState<Article | null>(null); // Для редактирования статьи
  // const [newArticleData, setNewArticleData] = useState({
  //   title: '',
  //   content: '',
  //   categoryId: 0
  // });

  // Загружаем статьи и категории при монтировании компонента
  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, []);

  const fetchArticles = async () => {
    try {
      const token = localStorage.getItem('accessToken'); // Получаем токен
      const response = await axios.get('/api/articles', {
        headers: {
          'Authorization': `Bearer ${token}`, // Добавляем токен в заголовки
        },
      });
      setArticles(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке статей:', error);
    }
  };

  // Функция для загрузки категорий
  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
      setLoading(false);
    } catch (error) {
      setError('Не удалось загрузить категории');
      setLoading(false);
    }
  };

  // Создание новой статьи
  const handleCreateArticle = async (data: { title: string; content: string; categoryId: number }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post('/api/articles', data, {
        headers: {
          Authorization: `Bearer ${token}`,  // Добавляем токен в заголовки
        },
      });
      setArticles([...articles, response.data]); // Добавляем новую статью в список
      // setArticles((prev) => [...prev, response.data]);
    } catch (error) {
      console.error('Ошибка при создании статьи:', error);
    }
  };

  // Редактирование статьи
  const handleEditArticle = (article: Article) => {
    console.log('Редактировать статью:', article);
    // Логика редактирования статьи
  };

  // Удаление статьи
  const handleDeleteArticle = async (id: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`/api/articles/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setArticles(articles.filter((article) => article.id !== id));
    } catch (error) {
      console.error('Ошибка при удалении статьи:', error);
    }
  };



  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  // Обязательно возвращаем JSX вне зависимости от логики
  return (
    <div className={styles.articlesContainer}>

      {/* Форма для создания/редактирования статьи */}
      <ArticleForm onSubmit={handleCreateArticle} categories={categories} />
      <ArticleList articles={articles} onDelete={handleDeleteArticle} />
    
      {/* Список статей */}
      {/* <ul>
        {articles.map((article) => (
          <li key={article.id}>
            <h3>{article.title}</h3>
            <p>{article.content}</p>
            <p>Категория: {article.category ? article.category.name : 'Без категории'}</p>
            <Button onClick={() => setEditingArticle(article)} name="Редактировать" />
            <Button onClick={() => handleDeleteArticle(article.id)} name="Удалить" />
          </li>
        ))}
      </ul> */}
    </div>
  );
};