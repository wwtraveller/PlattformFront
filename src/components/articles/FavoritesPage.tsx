import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('Для просмотра избранных статей необходимо авторизоваться.');
      setLoading(false);
      return;
    }

    const fetchFavoriteArticles = async () => {
      const favorites = localStorage.getItem('favorites');
      if (!favorites) {
        setFavoriteArticles([]);
        setLoading(false);
        return;
      }

      const favoriteIds = JSON.parse(favorites) as number[];
      const validArticles: Article[] = []; // Массив для найденных статей
      const updatedFavorites: number[] = []; // Для обновления localStorage

      try {
        const requests = favoriteIds.map(id =>
          axios.get(`/api/articles/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }).catch(error => {
            // Если сервер вернет 404, мы обработаем это
            if (error.response && error.response.status === 404) {
              console.warn(`Статья с ID ${id} не найдена и будет удалена из избранного.`);
              return null; // Возвращаем null для удаленных статей
            }
            throw error; // Если ошибка не связана с 404, выбрасываем её дальше
          })
        );

        const responses = await Promise.all(requests);

        // Обрабатываем ответы
        responses.forEach((response, index) => {
          if (response && response.data) {
            validArticles.push(response.data);
            updatedFavorites.push(favoriteIds[index]); // Только статьи, которые существуют
          }
        });

        // Обновляем избранные статьи и localStorage
        setFavoriteArticles(validArticles);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));

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
        <button onClick={() => navigate('/login')}>Перейти на страницу авторизации</button>
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
              <h4>{article.title}</h4>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavoritesPage;
