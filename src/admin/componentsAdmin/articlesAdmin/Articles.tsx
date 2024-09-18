import React, { useState, useEffect } from "react";
import axios from "axios";
import ArticleForm from "./ArticleForm";
import styles from "./articles.module.css";
import Comments from "components/comments/Comment";
import ArticleList from "./ArticleList";

// Определяем интерфейс для статьи
interface Article {
  id: number;
  title: string;
  content: string;
  categoryId: number;
}

const Articles = () => {
  const [articles, setArticles] = useState<Article[]>([]); // Используем интерфейс Article для типизации массива
  //const [selectedArticleId, setSelectedArticleId] = useState<number | null>(
  //  null
 // ); // добавила, для того чтобы привязать коментарии к статье
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
    //fetchCurrentUser(); // Получаем информацию о текущем пользователе
  }, []);

  // Функция для загрузки статей
  const fetchArticles = async () => {
    try {
      const response = await axios.get<Article[]>("/api/articles");
      setArticles(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке статей:", error);
    }
  };

  /*const fetchCurrentUser = async () => {
    try {
      const response = await axios.get("/api/users");
      setCurrentUser(response.data.username); // Предполагается, что имя пользователя приходит в поле username
    } catch (error) {
      console.error("Ошибка при получении информации о пользователе:", error);
    }
  };*/

  // Функция для создания статьи
  const handleCreate = async (data: {
    title: string;
    content: string;
    categoryId: number;
  }) => {
    try {
      await axios.post("/api/articles", data);
      fetchArticles();
    } catch (error) {
      console.error("Ошибка при создании статьи:", error);
    }
  };

  // Функция для редактирования статьи
  const handleEdit = (article: Article) => {
    // Логика для открытия формы с данными статьи
    // Можно передавать article в ArticleForm для редактирования
    console.log("Редактировать статью:", article);
    //setSelectedArticleId(article.id);
  };

  // Функция для удаления статьи
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/articles/${id}`);
      fetchArticles();
    } catch (error) {
      console.error("Ошибка при удалении статьи:", error);
    }
  };

  return (
    <div className={styles.articlesContainer}>
      <ArticleForm onSubmit={handleCreate} />
      <ArticleList
        articles={articles}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Articles;
