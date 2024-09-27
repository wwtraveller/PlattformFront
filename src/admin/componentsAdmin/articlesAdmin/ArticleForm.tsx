import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Определяем интерфейс для статьи
interface Article {
    id: number;
    title: string;
    content: string;
    photo: string | null;
    username: string;
    comments: any[];
}

// Определяем интерфейс для категорий
interface Category {
    id: number;
    name: string; 
}

interface ArticleFormProps {
    articleId: number | null;  
    categoryId: number | null; // Передаем categoryId
    categories: Category[];
    onSuccess: () => void;     
}

const ArticleForm: React.FC<ArticleFormProps> = ({ articleId, categoryId, categories, onSuccess }) => {
    const [article, setArticle] = useState<Article>({
        id: 0,
        title: '',
        content: '',
        photo: null,
        username: '',
        comments: [],
    });
    const [selectedCategory, setSelectedCategory] = useState<number | null>(categoryId); // Устанавливаем выбранную категорию из пропсов
    const [error, setError] = useState<string | null>(null);

    const checkAuthToken = (): string | null => {
        return localStorage.getItem('accessToken'); 
    };

    useEffect(() => {
        const fetchArticle = async () => {
            if (articleId) {
                const token = checkAuthToken(); 
                if (!token) {
                    setError('Токен не найден. Пожалуйста, войдите в систему.');
                    return;
                }
                
                try {
                    const response = await axios.get(`/api/articles/${articleId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setArticle(response.data);
                    setSelectedCategory(response.data.categories[0]?.id || null); 
                } catch (err) {
                    if (err instanceof Error) {
                        setError(err.message);
                    } else {
                        setError('Произошла неизвестная ошибка');
                    }
                }
            }
        };

        fetchArticle();
    }, [articleId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setArticle(prevState => ({ ...prevState, [name]: value }));
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(Number(e.target.value)); 
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const token = checkAuthToken();
      if (!token) {
          setError('Токен не найден. Пожалуйста, войдите в систему.');
          return;
      }
      try {
          const payload = {
              title: article.title,
              content: article.content,
              categories: selectedCategory ? [selectedCategory] : [],
          };
  
          console.log('Отправка данных:', payload); // Логирование перед отправкой
  
          if (articleId) {
              const response = await axios.put(`/api/articles/${articleId}`, payload, {
                  headers: { Authorization: `Bearer ${token}` },
              });
              console.log('Статья успешно отредактирована:', articleId, response.data); // Логирование ответа от сервера
          } else {
              await axios.post('/api/articles', payload, {
                  headers: { Authorization: `Bearer ${token}` },
              });
              console.log('Новая статья успешно создана');
          }
          onSuccess(); 
      } catch (err) {
          if (err instanceof Error) {
              setError(err.message);
          } else {
              setError('Произошла неизвестная ошибка');
          }
      }
  };
  

    return (
        <form onSubmit={handleSubmit}>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <input
                type="text"
                name="title"
                value={article.title}
                onChange={handleChange}
                placeholder="Заголовок"
                required
            />
            <textarea
                name="content"
                value={article.content}
                onChange={handleChange}
                placeholder="Содержимое"
                required
            />
            <select value={selectedCategory || ''} onChange={handleCategoryChange} required>
                <option value="" disabled>Выберите категорию</option>
                {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                ))}
            </select>
            <button type="submit">Сохранить</button>
        </form>
    );
};

export default ArticleForm;
