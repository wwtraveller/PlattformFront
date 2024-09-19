import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Comments from 'components/comments/Comment';


interface Article {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
}

const ArticlePageUser = () => {
  const { id } = useParams<{ id: string }>(); // Получаем id из параметров маршрута
  const [article, setArticle] = useState<Article | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log(`Fetching article with ID: ${id}`);
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`/api/articles/${id}`);
        console.log("Article data:", response.data);
        setArticle(response.data);
      } catch (error) {
        console.error("Ошибка при получении статьи:", error);
        setError("Ошибка при получении статьи.");
      }
    };
  
    if (id) {
      fetchArticle();
    }
  }, [id]);

  // Получаем данные текущего пользователя
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get("/api/users");
        setCurrentUser(response.data.username);
      } catch (error) {
        console.error("Ошибка при получении информации о пользователе:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  // Обработка ошибок
  if (error) {
    return <div>{error}</div>;
  }

  // Показ индикатора загрузки, пока статья не загрузилась
  if (!article) {
    return <div>Загрузка...</div>;
  }

  // Отображение статьи
  return (
    <div>
      <h1>{article.title}</h1>
      <img src={article.imageUrl} alt={article.title} />
      <p>{article.content}</p>
      <Comments
        articleId={article.id}
        currentUser={currentUser || "Guest"} // Передаем текущего пользователя в компонент комментариев
      />
    </div>
  );
};

export default ArticlePageUser;
