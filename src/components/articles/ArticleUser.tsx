import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAppSelector } from 'redux/hooks';
import styles from '../articles/articleUser.module.css';
import ButtonLogReg from 'components/button/ButtonLogReg';

interface Article {
  id: number;
  title: string;
  shortDescription: string;
  imageUrl: string;
}

const ArticleUser = () => {
  const { category } = useParams<{ category: string }>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Индикация загрузки
  const [redirectPath, setRedirectPath] = useState<string | undefined>(undefined);
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(`/api/articles`, {
          params: { category },
        });
        setArticles(response.data);
      } catch (error) {
        console.error("Ошибка при получении статей:", error);
        setError("Ошибка при получении статей.");
      } finally {
        setLoading(false); // Останавливаем индикацию загрузки
      }
    };

    if (category) {
      fetchArticles();
    }
  }, [category]);

  const handleLoginSuccess = (path?: string) => {
    if (path) {
      navigate(path);
    } else {
      navigate('/');
    }
  };

  const handleReadMoreClick = (path: string) => {
    setRedirectPath(path);
    navigate('/login');
  };

  const defaultImageUrl = "https://st2.depositphotos.com/4152719/8388/i/450/depositphotos_83882536-stock-photo-competitive-pricing-concept-image-with.jpg";

  if (loading) {
    return <p>Загрузка статей...</p>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Обновить страницу</button>
        <Link to="/categories">Вернуться к списку категорий</Link>
      </div>
    );
  }

  return (
    <div className={styles.articlesContainer}>
      <h2>Статьи в категории {category}</h2>
      {articles.length > 0 ? (
        articles.map((article) => (
          <div key={article.id} className={styles.article}>
            <img src={article.imageUrl || defaultImageUrl} alt={article.title} className={styles.articleImage} />
            <div className={styles.articleContent}>
              <h3 className={styles.articleTitle}>{article.title}</h3>
              <p className={styles.shortDescription}>{article.shortDescription}</p>
              
              {user?.username ? (
                <Link to={`/articles/${article.id}`} className={styles.readMoreLink}>
                  Читать далее
                </Link>
              ) : (
                <div className={styles.authAction}>
                  <p>Для полного прочтения статьи войдите в систему</p>
                  <ButtonLogReg
                    onLoginSuccess={handleLoginSuccess}
                    redirectPath={`/articles/${article.id}`} // Передаем путь к статье
                    className={styles.buttonRight}
                  />
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <div>
          <p>Нет статей для этой категории.</p>
          <Link to="/categories">Вернуться к списку категорий</Link>
        </div>
      )}
    </div>
  );
};

export default ArticleUser;
