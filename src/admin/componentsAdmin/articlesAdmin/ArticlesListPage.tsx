import React, { useEffect, useState } from 'react';
import ArticleList from './ArticleList'; 
import axios from 'axios';
import ArticleForm from './ArticleForm';
import Loader from 'components/loader/Loader';

interface Article {
    id: number;
    title: string;
    content: string;
    photo: string | null;
    username: string;
    comments: any[];
    categories: Category[];
}

interface Category {
    id: number;
    name: string;
    articles: Article[];
}
const ArticlesListPage = () => {
    const [articles, setArticles] = useState<Article[]>([]); 
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState<string | null>(null); 
    const [editingArticleId, setEditingArticleId] = useState<number | null>(null); // ID редактируемой статьи
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await axios.get('/api/articles'); 
                setArticles(response.data); 
                const timer = setTimeout(() => {
                    setLoading(false);
                  }, 2000); // Загрузчик будет виден 3 секунды
          
                  // Очистка таймера
                  return () => clearTimeout(timer);
            } catch (err) {
                setError('Ошибка при загрузке статей');
                console.error(err);
            }
        };

        fetchArticles();
    }, []); 
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/api/categories');
                setCategories(response.data);
            } catch (err) {
                setError('Ошибка при загрузке категорий');
                console.error(err);
            }
        };

        fetchCategories();
    }, []);

    const handleEdit = (id: number) => {
        setEditingArticleId(id);
        setIsEditing(true);
    };

    const handleDelete = async (id: number) => {
        // Функция для получения токена
        const token = localStorage.getItem('accessToken'); 
    
        if (!token) {
            setError('Токен не найден. Пожалуйста, войдите в систему.');
            return;
        }
    
        try {
            await axios.delete(`/api/articles/${id}`, {
                headers: { Authorization: `Bearer ${token}` }, // Передаем токен в заголовках
            });
            setArticles(articles.filter((article) => article.id !== id)); // Обновляем список статей
            console.log(`Статья с id ${id} удалена`);
        } catch (err) {
            setError('Ошибка при удалении статьи');
            console.error(err);
        }
    };
    

    // Закрытие формы и обновление списка после редактирования
    const handleSuccess = () => {
        setIsEditing(false);
        setEditingArticleId(null);

        // После успешного редактирования обновляем список статей
        const fetchArticles = async () => {
            try {
                const response = await axios.get('/api/articles');
                setArticles(response.data);
            } catch (err) {
                setError('Ошибка при загрузке статей');
                console.error(err);
            }
        };

        fetchArticles();
    };

    if (!articles) {
        return (
          <div>
            <h1>Загрузка...</h1>
            <Loader />
          </div>
        );
      }
    
    return (
        <div>
            {/* Список статей */}
            {!isEditing ? (
                <ArticleList 
                    articles={articles} 
                    onEdit={handleEdit} 
                    onDelete={handleDelete} 
                />
            ) : (
                // Форма редактирования
                <ArticleForm 
                    articleId={editingArticleId} 
                    categoryId={null} 
                    categories={categories} 
                    onSuccess={handleSuccess} 
                />
            )}
        </div>
    );
};

export default ArticlesListPage;
