import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { useAppSelector } from "redux/hooks";
import styles from "../articles/articleUser.module.css";
import ButtonLogReg from "components/button/ButtonLogReg";

interface Article {
  id: number;
  title: string;
  shortDescription: string;
  imageUrl: string | null; // Теперь photo может быть null
  categories: { id: number; name: string }[]; // Массив категорий
}

const ArticleUser = () => {
  const { category } = useParams<{ category: string }>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Индикация загрузки
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const articlesPerPage = 6; // Количество статей на странице
  const location = useLocation();

  useEffect(() => {
    // Скролл вверх при изменении страницы
    window.scrollTo(0, 0);
  }, [location.pathname]); 

  useEffect(() => {
    window.scrollTo(0, 0); // Скролл вверх при изменении страницы
  }, [currentPage]); 

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(`/api/articles`);
        // Фильтруем статьи, проверяя наличие категории в массиве categories
        const filteredArticles = response.data.filter((article: Article) =>
          article.categories.some((cat) => cat.name === category)
        );
        setArticles(filteredArticles);
      } catch (error) {
        console.error("Ошибка при получении статей:", error);
        setError("Ошибка при получении статей.");
      } finally {
        setLoading(false);
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
      navigate("/articles");
    }
  };

  const defaultImageUrl =
    "https://images.unsplash.com/photo-1617375819318-67968e5b25c3?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  if (loading) {
    return <p>Загрузка статей...</p>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Обновить страницу
        </button>
        <Link to="/categories">Вернуться к списку категорий</Link>
      </div>
    );
  }

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );
  const totalPages = Math.ceil(articles.length / articlesPerPage);


  return (
    <div className={styles.mainArticlesTitle}>
      <h2>Статьи в категории {category}</h2>
      <div className={styles.articlesContainer}>
        {currentArticles.length > 0 ? (
          currentArticles.map((article, index) => (
            <div key={index} className={styles.articleBox}>
            <div key={article.id} className={styles.boxInBox}>
              
              <div className={styles.articleImage}
                style={{
                  backgroundImage: `url(${article.imageUrl || defaultImageUrl})`,
                }}
              ></div>
              <div className={styles.articleBackground}>
                <h3 className={styles.articleTitle}>{article.title}</h3>
              </div>
              <div className={styles.inboxButtons}>
                <p className={styles.shortDescription}>
                  {article.shortDescription}
                </p>

                {user?.username ? (
                  <div className={styles.readMoreWrapper}>
                      <span>Читать далее</span>
                  <Link
                    to={`/articles/${article.id}`}
                    className={styles.readMoreLink}
                  >
                   <span className={styles.arrowIcon}>→</span>
                  </Link>
                  </div>
                ) : (
                  <div className={styles.authAction}>
                    <p>Хочешь больше? Зарегистрируйся!</p>
                    <ButtonLogReg
                      onLoginSuccess={handleLoginSuccess}
                      redirectPath={`/articles/${article.id}`} // Передаем путь к статье
                      className={styles.buttonRight}
                    />
                  </div>
                )}
              </div>
              </div>
            </div>
          ))
        ) : (
          <div>
            <p>Нет статей для этой категории.</p>
            <Link to="/catLinks">Вернуться к списку категорий</Link>
          </div>
        )}
        </div>
        <div className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage (index + 1)}
              className={`${styles.pageButton} ${currentPage === index + 1 ? styles.active : ""}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
    </div>
  );
};

export default ArticleUser;
