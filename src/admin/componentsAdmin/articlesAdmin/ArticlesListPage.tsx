import React, { useEffect, useState } from 'react';
import ArticleList from './ArticleList'; 
import axios from 'axios';

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

    useEffect(() => {
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
    }, []); 

    const handleEdit = (id: number) => {
        console.log('Редактировать статью с id:', id);
    };

    const handleDelete = (id: number) => {
        console.log('Удалить статью с id:', id);
    };

    return (
        <div>
            {error && <div style={{ color: 'red' }}>{error}</div>} 
            <ArticleList articles={articles} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
    );
};

export default ArticlesListPage;
