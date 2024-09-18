import React, { useState } from 'react';
import styles from './articleForm.module.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Интерфейс для пропсов
interface ArticleFormProps {
  onSubmit: (data: { title: string; content: string; categoryId: number }) => void;
  categories: { id: number; name: string }[];
}

const ArticleForm: React.FC<ArticleFormProps> = ({ onSubmit, categories }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Преобразуем categoryId в число перед отправкой
    const numericCategoryId = Number(categoryId);
    if (!isNaN(numericCategoryId)) {
      onSubmit({ title, content, categoryId: numericCategoryId });
    } else {
      console.error('Некорректная категория');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        placeholder="Заголовок"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={styles.input}
      />
      <ReactQuill
        value={content}
        onChange={setContent}
        className={styles.textarea}
        placeholder="Содержание"
      />
      <select
        value={categoryId}
        onChange={(e) => setCategoryId(Number(e.target.value))}
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
        Создать статью
      </button>
    </form>
  );
};

export default ArticleForm;
