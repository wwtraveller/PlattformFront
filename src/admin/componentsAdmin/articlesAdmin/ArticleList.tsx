import React, { useEffect, useState } from 'react';
import styles from './articleList.module.css';
import axios from 'axios';

interface Article {
  id: number;
  title: string;
  content: string;
  photo: string | null;
  username: string;
  comments: any[];
  categories: Category[];
}

interface Category {
  id: number;
  name: string;
  articles: Article[];
}

interface ArticleListProps {
  articles: Article[];
  onEdit: (articleId: number) => void;
  onDelete: (articleId: number) => void;
}

const ArticleList = ({ articles, onEdit, onDelete }: ArticleListProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Получение категорий из API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories'); // Конечная точка для получения категорий
        setCategories(response.data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Произошла неизвестная ошибка');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Функция для изменения выбранной категории
  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategory(categoryId);
  };

  // Фильтруем статьи по выбранной категории
  const filteredArticles = selectedCategory
    ? articles.filter((article) =>
        article.categories.some((cat) => cat.id === selectedCategory)
      )
    : articles;

  if (loading) return <p>Загрузка категорий...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <div className={styles.articleList}>
      <div>
        <label>Категории:</label>
        <select
          onChange={(e) => handleCategoryChange(Number(e.target.value))}
          value={selectedCategory || ''}
        >
          <option value="">Все категории</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <h2>Список артиклей</h2>
      <ul>
        {filteredArticles.map((article) => (
          <li key={article.id}>
            <strong>{article.title}</strong> — Автор: {article.username}
            <div className={styles.buttonGroup}>
              <button onClick={() => onEdit(article.id)}>Редактировать</button>
              <button onClick={() => onDelete(article.id)}>Удалить</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ArticleList;
