// src/components/articles/ArticleList.tsx
import React from 'react';
import styles from './articles.module.css'; // Импортируем общий CSS файл

interface Article {
  id: number;
  title: string;
  content: string;
  categoryId: number;
}

interface ArticleListProps {
  articles: Article[];
  onEdit: (article: Article) => void;
  onDelete: (id: number) => void;
}

const ArticleList = (props: ArticleListProps) => {
  const { articles, onEdit, onDelete } = props; // Деструктуризация пропсов

  return (
    <ul className={styles.articleList}>
      {articles.map((article) => (
        <li key={article.id} className={styles.articleItem}>
          <h4>{article.title}</h4>
          <p>{article.content.substring(0, 100)}...</p>
          <button onClick={() => onEdit(article)} className={styles.editButton}>
            Редактировать
          </button>
          <button onClick={() => onDelete(article.id)} className={styles.deleteButton}>
            Удалить
          </button>
        </li>
      ))}
    </ul>
  );
};

export default ArticleList;
