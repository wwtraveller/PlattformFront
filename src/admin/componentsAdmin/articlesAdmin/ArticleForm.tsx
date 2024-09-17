// src/components/articles/ArticleForm.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './articles.module.css'; // Импортируем общий CSS файл

interface ArticleFormProps {
  onSubmit: (data: { title: string; content: string; categoryId: number }) => void;
  initialData?: { title: string; content: string; categoryId: number };
}

const ArticleForm: React.FC<ArticleFormProps> = ({ onSubmit, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [categoryId, setCategoryId] = useState<number>(initialData?.categoryId || 0);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    axios.get('/api/categories').then((response) => {
      setCategories(response.data);
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, content, categoryId });
    setTitle('');
    setContent('');
    setCategoryId(0);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Заголовок статьи"
        required
        className={styles.input}
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Содержание статьи"
        required
        className={styles.textarea}
      ></textarea>
      <select
        value={categoryId}
        onChange={(e) => setCategoryId(Number(e.target.value))}
        required
        className={styles.select}
      >
        <option value="">Выберите категорию</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <button type="submit" className={styles.submitButton}>
        {initialData ? 'Сохранить изменения' : 'Создать статью'}
      </button>
    </form>
  );
};

export default ArticleForm;
