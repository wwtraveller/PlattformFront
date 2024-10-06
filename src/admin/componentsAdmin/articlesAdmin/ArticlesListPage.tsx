import React, { useEffect, useState } from 'react';
import ArticleList from './ArticleList'; 
import axios from 'axios';
import ArticleForm from './ArticleForm';
import Modal from 'components/modal/Modal';
 // Подключаем модальный компонент

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

    // Alena:
    const [isModalOpen, setIsModalOpen] = useState(false); // Управление модальным окном
    const [articleToDelete, setArticleToDelete] = useState<number | null>(null); // ID статьи для удаления

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

    const handleDelete = async () => {
        if (articleToDelete === null) return;

        const token = localStorage.getItem('accessToken'); 
        if (!token) {
            setError('Токен не найден. Пожалуйста, войдите в систему.');
            return;
        }

        try {
            await axios.delete(`/api/articles/${articleToDelete}`, {
                headers: { Authorization: `Bearer ${token}` }, 
            });
            setArticles(articles.filter((article) => article.id !== articleToDelete));
            setArticleToDelete(null); // Сброс состояния
            setIsModalOpen(false); // Закрываем модальное окно
        } catch (err) {
            setError('Ошибка при удалении статьи');
            console.error(err);
        }
    };
    
    // Alena
    const confirmDelete = (id: number) => {
        setArticleToDelete(id);
        setIsModalOpen(true); // Открываем модальное окно
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setArticleToDelete(null); // Сброс ID статьи
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

    return (
        <div>
            {/* Модальное окно подтверждения удаления */}
            <Modal
                isOpen={isModalOpen}
                title="Удалить статью?"
                onClose={handleCloseModal}
                onConfirm={handleDelete}
            >
                <p>Вы уверены, что хотите удалить эту статью? Это действие необратимо.</p>
            </Modal>

            {/* Список статей */}
            {!isEditing ? (
                <ArticleList 
                    articles={articles} 
                    onEdit={handleEdit} 
                    // onDelete={handleDelete} 
                    onDelete={confirmDelete} // Вызываем модалку при удалении
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
