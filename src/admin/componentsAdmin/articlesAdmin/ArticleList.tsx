// src/components/articles/ArticleList.tsx
import React from 'react';
import { useEffect } from 'react';
import styles from './articles.module.css'; // Импортируем общий CSS файл

interface Article {
  id: number;
  title: string;
  content: string;
  category: { id: number; name: string };
}

interface ArticleListProps {
  articles: Article[];
  onEdit: (article: Article) => void;
  onDelete: (id: number) => void;
  fetchArticles: () => void;
}

const ArticleList = ({ articles, onEdit, onDelete, fetchArticles }: ArticleListProps) => {
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return (
    <div className={styles.list}>
      {articles.map((article) => (
        <div key={article.id} className={styles.article}>
          <h3>{article.title}</h3>
          <p>{article.content}</p>
          <p>Категория: {article.category.name}</p>
          <button onClick={() => onEdit(article)} className={styles.editButton}>
            Редактировать
          </button>
          <button onClick={() => onDelete(article.id)} className={styles.deleteButton}>
            Удалить
          </button>
        </div>
      ))}
    </div>
  );
};

export default ArticleList;
