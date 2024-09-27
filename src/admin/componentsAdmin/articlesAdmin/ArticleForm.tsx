import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styles from './articleForm.module.css';

interface ArticleFormProps {
  onSubmit: (data: { title: string; content: string; categoryId: number }) => void;
  categories: { id: number; name: string }[];
}

export default function ArticleForm({ onSubmit, categories }: ArticleFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (categoryId !== '') {
      onSubmit({ title, content, categoryId: Number(categoryId) });
      setTitle('');
      setContent('');
      setCategoryId('');
    }
  };

  return (
    <form className={styles.articleForm} onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Заголовок"
        className={styles.input}
      />
      <ReactQuill value={content} onChange={setContent} className={styles.textarea} />
      
      <div className={styles.categoryBlock}>
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
      </div>
      
      <button type="submit" className={styles.submitButton}>
        Создать статью
      </button>
    </form>
  );
}
