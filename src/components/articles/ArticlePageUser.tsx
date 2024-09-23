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
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken'); // Получаем токен из localStorage
    console.log(`Token: ${token}`);

    if (!token) {
      console.error('Токен отсутствует. Пожалуйста, авторизуйтесь.');
      setError('Токен отсутствует. Пожалуйста, авторизуйтесь.');
      return;
    }

    const fetchArticle = async () => {
      try {
        const response = await axios.get(`/api/articles/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,  // Передаем токен авторизации
          },
        });
        console.log("Article data:", response.data);
        setArticle(response.data);
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          console.error("Ошибка при получении статьи:", error);
          if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
          }
        }
        setError("Ошибка при получении статьи.");
      }
    };
  
    if (id) {
      fetchArticle();
    }
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return;
    }

    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get("/api/users", {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setCurrentUser(response.data.username);
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          console.error("Ошибка при получении информации о пользователе:", error);
        }
      }
    };

    fetchCurrentUser();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!article) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <h1>{article.title}</h1>
      <img src={article.imageUrl} alt={article.title} />
      <p>{article.content}</p>
      <Comments
        articleId={article.id}
        currentUser={currentUser || "Guest"}
      />
    </div>
  );
};

export default ArticlePageUser;
