import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ArticleForm from './ArticleForm';
import { useNavigate } from 'react-router-dom';
import styles from './articles.module.css'

// Интерфейсы для статей и категорий
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

const Articles = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const navigate = useNavigate(); // Создайте навигатор
   

    const checkAuthToken = () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            throw new Error('Нет токена доступа. Пожалуйста, авторизуйтесь.');
        }
        return token;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = checkAuthToken();
                const categoriesResponse = await axios.get('/api/categories', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCategories(categoriesResponse.data);

                const articlesResponse = await axios.get('/api/articles', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setArticles(articlesResponse.data);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Произошла неизвестная ошибка');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleCategoryChange = (categoryId: number) => {
        setSelectedCategory(categoryId);
    };

    const handleCreateArticle = () => {
        setSelectedArticle(null);
        setIsCreating(true);
    };

    const handleEditArticle = (articleId: number) => {
        const article = articles.find((a) => a.id === articleId);
        setSelectedArticle(article || null);
        setIsCreating(true);
    };

    const handleDeleteArticle = async (articleId: number) => {
        try {
            const token = checkAuthToken();
            await axios.delete(`/api/articles/${articleId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setArticles((prevArticles) => prevArticles.filter((a) => a.id !== articleId));
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Произошла неизвестная ошибка');
            }
        }
    };

    const handleFormSuccess = () => {
        setIsCreating(false);
        setSelectedArticle(null);
        const fetchUpdatedArticles = async () => {
            try {
                const token = checkAuthToken();
                const response = await axios.get('/api/articles', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setArticles(response.data);
                console.log('Статьи успешно обновлены:', response.data);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Произошла неизвестная ошибка');
                }
            }
        };

        fetchUpdatedArticles();
    };

    if (loading) return <p>Загрузка данных...</p>;
    if (error) return <p>Ошибка: {error}</p>;

    const filteredArticles = selectedCategory
        ? articles.filter((article) =>
              article.categories.some((cat) => cat.id === selectedCategory),
          )
        : articles;


    return (
        <div className={styles.articles}>
            <h3 className={styles.h3}>Управление артиклями</h3>

{/* Кнопка для перехода на страницу со списком артиклей */}
<button className={styles.button} onClick={() => navigate('/articlesList')}>Список артиклей</button>
            {/* Фильтр по категориям 
            <div>
                <label>Категории:</label>
                <select onChange={(e) => handleCategoryChange(Number(e.target.value))} value={selectedCategory || ''}>
                    <option value="">Все категории</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>*/}

            {/* Список артиклей 
            <ArticleList articles={filteredArticles} onEdit={handleEditArticle} onDelete={handleDeleteArticle} />*/}

            {/* Кнопка для создания нового артикля */}
            <button className={styles.button} onClick={handleCreateArticle}>Создать новый артикль</button>

            {/* Форма для создания/редактирования артикля */}
            {isCreating && (
                <ArticleForm
                    articleId={selectedArticle ? selectedArticle.id : null}
                    categoryId={selectedArticle ? selectedArticle.categories[0]?.id : null}
                    categories={categories}
                    onSuccess={handleFormSuccess}
                />
            )}
        </div>
    );
};

export default Articles;
