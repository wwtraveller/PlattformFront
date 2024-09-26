import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // используем useNavigate вместо useHistory

interface Article {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
}

const FavoritesPage = () => {
  const [favoriteArticles, setFavoriteArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate(); // инициализация useNavigate

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      // Если токен отсутствует, отображаем ошибку и не продолжаем запросы
      setError('Для просмотра избранных статей необходимо авторизоваться.');
      setLoading(false);
      return;
    }

    // Получаем избранные статьи из localStorage
    const fetchFavoriteArticles = async () => {
      const favorites = localStorage.getItem('favorites');
      if (!favorites) {
        setFavoriteArticles([]);
        setLoading(false);
        return;
      }

      const favoriteIds = JSON.parse(favorites) as number[];

      try {
        const requests = favoriteIds.map(id =>
          axios.get(`/api/articles/${id}`, {
            headers: { Authorization: `Bearer ${token}` }, // Передаем токен в запросы
          })
        );
        const responses = await Promise.all(requests);
        const articles = responses.map(response => response.data);
        setFavoriteArticles(articles);
      } catch (error: any) {
        setError('Ошибка при загрузке избранных статей.');
        console.error('Ошибка при получении избранных статей:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteArticles();
  }, []);

  if (loading) {
    return <div>Загрузка избранных статей...</div>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={() => navigate('/login')}>Перейти на страницу авторизации</button> {/* Используем navigate для перехода */}
      </div>
    );
  }

  if (favoriteArticles.length === 0) {
    return <div>Нет избранных статей.</div>;
  }

  return (
    <div>
      <h1>Избранные статьи</h1>
      <ul>
        {favoriteArticles.map(article => (
          <li key={article.id}>
            <Link to={`/articles/${article.id}`}>
              <h4>{article.title}</h4> {/* Отображаем только заголовок */}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavoritesPage;
