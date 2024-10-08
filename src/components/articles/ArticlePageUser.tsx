import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Comments from "components/comments/Comment";
import styles from "./articlePageUser.module.css";
import Loader from "components/loader/Loader";

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
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    console.log(`Token: ${token}`);

    if (!token) {
      console.error("Токен отсутствует. Пожалуйста, авторизуйтесь.");
      setError("Токен отсутствует. Пожалуйста, авторизуйтесь.");
      return;
    }

    const fetchArticle = async () => {
      try {
        const response = await axios.get(`/api/articles/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Article data:", response.data);
        setArticle(response.data);
        const timer = setTimeout(() => {
          setLoading(false);
        }, 2000); // Загрузчик будет виден 3 секунды

        // Очистка таймера
        return () => clearTimeout(timer);
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
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return;
    }

    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get("/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCurrentUser(response.data.username);
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          console.error(
            "Ошибка при получении информации о пользователе:",
            error
          );
        }
      }
    };

    fetchCurrentUser();
  }, []);

  // Проверяем, есть ли статья в избранном при загрузке страницы
  useEffect(() => {
    if (article) {
      const favorites = localStorage.getItem("favorites");
      if (favorites) {
        const parsedFavorites = JSON.parse(favorites);
        setIsFavorite(parsedFavorites.includes(article.id));
      }
    }
  }, [article]);

  // Функция для добавления или удаления статьи из избранного
  const toggleFavorite = () => {
    const favorites = localStorage.getItem("favorites");
    let favoritesArray: number[] = favorites ? JSON.parse(favorites) : [];

    if (isFavorite) {
      // Если уже в избранном, удаляем
      favoritesArray = favoritesArray.filter((favId) => favId !== article?.id);
    } else {
      // Если не в избранном, добавляем
      favoritesArray.push(article!.id);
    }

    localStorage.setItem("favorites", JSON.stringify(favoritesArray));
    setIsFavorite(!isFavorite); // Меняем состояние
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!article) {
    return (
      <div>
        <h1>Загрузка...</h1>
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full md:w-1/2">
      <h3 className={styles.title}>{article.title}</h3>
      {/*<img src={article.imageUrl} alt={article.title} />*/}
      {/* <p>{article.content}</p> */}
      {/* Кнопка добавления в избранное */}
      <button
        onClick={toggleFavorite}
        style={{ background: "none", border: "none", cursor: "pointer" }}
      >
        <i
          className={isFavorite ? "fas fa-star" : "far fa-star"}
          style={{ color: isFavorite ? "gold" : "gray", fontSize: "24px" }}
        />
      </button>
      <div
        className={styles.articlecontent}
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      <Comments
        article_id={article.id}
        currentUserId={currentUser || "Guest"}
      />
    </div>
  );
};

export default ArticlePageUser;
