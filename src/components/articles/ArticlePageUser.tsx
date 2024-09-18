import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Comments from 'components/comments/Comment';
import styles from '../articles/articleUser.module.css';

interface Article {
  id: number;
  title: string;
  content: string;
}

const ArticlePageUser = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`/api/articles/${id}`);
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

  if (error) {
    return <div>{error}</div>;
  }

  if (!article) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <h2>{article.title}</h2>
      <p>{article.content}</p> {/* Полный текст статьи */}
      <div className={styles.commentsContainer}>
        <Comments
          articleId={article.id}
          currentUser={currentUser || "Guest"}
        />
      </div>
    </div>
  );
};

export default ArticlePageUser;

