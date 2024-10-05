import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import styles from './favoritesPage.module.css';

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
      const validArticles: Article[] = [];
      const updatedFavorites: number[] = [];

      try {
        const requests = favoriteIds.map(id =>
          axios.get(`/api/articles/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }).catch(error => {
            if (error.response && error.response.status === 404) {
              console.warn(`Статья с ID ${id} не найдена и будет удалена из избранного.`);
              return null;
            }
            throw error;
          })
        );

        const responses = await Promise.all(requests);

        responses.forEach((response, index) => {
          if (response && response.data) {
            validArticles.push(response.data);
            updatedFavorites.push(favoriteIds[index]);
          }
        });

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
    return <div className={styles.loading}>Загрузка избранных статей...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <button className={styles.authButton} onClick={() => navigate('/login')}>Перейти на страницу авторизации</button>
      </div>
    );
  }

  if (favoriteArticles.length === 0) {
    return <div className={styles.noFavorites}>Нет избранных статей.</div>;
  }

  return (
    <div className={styles.favoritesPage}>
      <h1 className={styles.title}>Избранные статьи</h1>
      <ul className={styles.articleList}>
        {favoriteArticles.map(article => (
          <li key={article.id} className={styles.articleItem}>
            <Link to={`/articles/${article.id}`} className={styles.articleLink}>
              <h4 className={styles.articleTitle}>{article.title}</h4>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavoritesPage;
