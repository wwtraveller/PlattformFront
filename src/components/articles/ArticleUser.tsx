import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from 'redux/hooks'; // Импортируем хук для проверки авторизации
import Button from 'components/button/Button'; // Компонент кнопки
import styles from '../articles/articleUser.module.css';

interface Article {
  id: number;
  title: string;
  summary: string;
  content: string;
  category: string;
}

const ArticleUser = () => {
  const { category } = useParams<{ category: string }>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Получаем данные пользователя из состояния, чтобы проверить, авторизован ли он
  const { user } = useAppSelector((state) => state.user);
  const navigate = useNavigate();

  // Функция для редиректа на страницу логина
  const handleLoginRedirect = () => {
    navigate('/login');
  };

  // Получение статей на основе категории
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
      }
    };

    if (category) {
      fetchArticles();
    }
  }, [category]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Статьи в категории {category}</h2>
      {articles.length > 0 ? (
        articles.map((article) => (
          <div key={article.id}>
            {/* Если пользователь авторизован, показываем ссылку на полную статью */}
            {user?.username ? (
              <Link to={`/article/${article.id}`}>
                <h3>{article.title}</h3> {/* Заголовок статьи, кликабельный */}
              </Link>
            ) : (
              <div className={styles.authAction}>
                <h3>{article.title}</h3>
                <p>{article.summary}</p> {/* Краткое содержание статьи */}
                <p>Для доступа к полной статье войдите в систему</p>
                <Button name="Войти" onClick={handleLoginRedirect} /> {/* Кнопка для входа */}
              </div>
            )}
          </div>
        ))
      ) : (
        <p>Нет статей для этой категории.</p>
      )}
    </div>
  );
};

export default ArticleUser;
