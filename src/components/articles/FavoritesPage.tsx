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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [articlesPerPage] = useState<number>(6);
  const [showModal, setShowModal] = useState<{ visible: boolean, id: number | null, x: number, y: number }>({ visible: false, id: null, x: 0, y: 0 });
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

  const removeFromFavorites = (id: number) => {
    setFavoriteArticles((prevArticles) => prevArticles.filter(article => article.id !== id));
    
    const favorites = localStorage.getItem('favorites');
    if (favorites) {
      const favoriteIds = JSON.parse(favorites) as number[];
      const updatedFavorites = favoriteIds.filter(favoriteId => favoriteId !== id);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    }
  };

  const confirmRemoveFromFavorites = (id: number, x: number, y: number) => {
    setShowModal({ visible: true, id, x, y });
  };

  const handleModalConfirm = () => {
    if (showModal.id !== null) {
      removeFromFavorites(showModal.id);
    }
    setShowModal({ visible: false, id: null, x: 0, y: 0 });
  };

  const handleModalCancel = () => {
    setShowModal({ visible: false, id: null, x: 0, y: 0 });
  };

  // Пагинация: рассчитать индексы статей для текущей страницы
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = favoriteArticles.slice(indexOfFirstArticle, indexOfLastArticle);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(favoriteArticles.length / articlesPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleNextPage = () => {
    if (currentPage < pageNumbers.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

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
        {currentArticles.map(article => (
          <li key={article.id} className={styles.articleItem}>
            <Link to={`/articles/${article.id}`} className={styles.articleLink}>
              <h4 className={styles.articleTitle}>{article.title}</h4>
            </Link>
            <button 
              className={styles.removeFavorite} 
              onClick={(e) => confirmRemoveFromFavorites(article.id, e.clientX, e.clientY)} // Передаем позицию клика
            >
              ⭐
            </button>
          </li>
        ))}
      </ul>

      {/* Пагинация */}
      <div className={styles.pagination}>
        <button onClick={handlePrevPage} disabled={currentPage === 1} className={styles.pageArrow}>
          ←
        </button>
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={`${styles.pageItem} ${number === currentPage ? styles.active : ''}`}
          >
            {number}
          </button>
        ))}
        <button onClick={handleNextPage} disabled={currentPage === pageNumbers.length} className={styles.pageArrow}>
          →
        </button>
      </div>

      {/* Модальное окно подтверждения удаления */}
      {showModal.visible && (
        <div 
          className={styles.modal} 
          style={{ top: showModal.y, left: showModal.x }} // Устанавливаем позицию модального окна
        >
          <div className={styles.modalContent}>
            <p>Вы уверены, что хотите удалить статью из избранного?</p>
            <button onClick={handleModalConfirm} className={styles.confirmButton}>Да</button>
            <button onClick={handleModalCancel} className={styles.cancelButton}>Нет</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
