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
  content: string; // Добавляем поле content
  imageUrl: string | null; // Теперь photo может быть null
  categories: { id: number; name: string }[]; // Массив категорий
}

const ArticleUser = () => {
  const { category } = useParams<{ category: string }>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [latestArticle, setLatestArticle] = useState<Article | null>(null); // Состояние для последней статьи
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Индикация загрузки
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const articlesPerPage = 6; // Количество статей на странице
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Управление модальным окном
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    // Скролл вверх при изменении страницы
    window.scrollTo({
      top:0, 
      left: 0,
       behavior: 'smooth'});
  }, [location.pathname, currentPage]); 


  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(`/api/articles`);
        // Фильтруем статьи, проверяя наличие категории в массиве categories
        console.log("Articles from API:", response.data); // Добавляем лог для проверки данных

        const filteredArticles = response.data.filter((article: Article) =>
          article.categories.some((cat) => cat.name === category)
        );
         // Сортируем статьи, чтобы найти последнюю
         filteredArticles.sort((a: { id: number; }, b: { id: number; }) => b.id - a.id); // Предполагается, что ID статьи увеличивается с каждым созданием
         setLatestArticle(filteredArticles[0] || null); // Устанавливаем последнюю статью
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
    }setIsModalOpen(false); // Закрываем модальное окно после успешного входа
  };

  const handleButtonLogRegClick = (path: string) => {
    setRedirectPath(path); // Устанавливаем путь для перенаправления
    setIsModalOpen(true); // Открываем модальное окно
  };

  const truncateText = (text: string, limit: number) => {
    return text.length > limit ? text.substring(0, limit) + "..." : text;
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

  const cleanedContent = latestArticle?.content?.replace(/style="[^"]*"/g, '') || ''; // Если latestArticle или content равен null, то будет использовано пустое значение.


  return (
    <div className={styles.mainArticlesTitle}>
         {/* Блок с последней статьей */}
         {latestArticle && (
        <div className={styles.latestArticle}>
          <h2>Последняя статья</h2>
          <div className={styles.latestArticleBox}>
            <div className={styles.latestBoxInBox}>
              <div
                className={styles.latestArticleImage}
                style={{
                  backgroundImage: `url(${latestArticle.imageUrl || defaultImageUrl})`,
                }}
              ></div>
              <div className={styles.latestArticleContent}>
                <h4 className={styles.latestArticleTitle}>{latestArticle.title}</h4>
              <div className={styles.latestShortDescription}
      dangerouslySetInnerHTML={{ __html: cleanedContent }} // Используем очищенный контент
      >
              </div>
                  </div>

              {user?.username ? (
                  <div className={styles.latestReadMoreWrapper}>
                      <span>Читать далее</span>
                  <Link
                  to={`/articles/${latestArticle.id}`}
                  className={styles.latestReadMoreLink}
                  >
                   <span className={styles.arrowIcon}>→</span>
                  </Link>
                  </div>
                ) : (
                  <div className={styles.authAction}>
                    <span>Узнать подробнее?</span>
                    <ButtonLogReg
                      onLoginSuccess={handleLoginSuccess}
                      redirectPath={`/articles/${latestArticle.id}`} // Передаем путь к статье
                      className={styles.buttonRight}
                    />
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

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
                    <span>Узнать подробнее?</span>
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
