import React, { useEffect, useState } from 'react';
import styles from './articleList.module.css';
import axios from 'axios';
import DeleteModal from './DeleteModal';
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

interface ArticleListProps {
  articles: Article[];
  onEdit: (articleId: number) => void;
  onDelete: (articleId: number) => void;
}

const ArticleList = ({ articles, onEdit, onDelete }: ArticleListProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);

  // Пагинация: текущее состояние страницы
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6; // Количество статей на странице

  // Получение категорий из API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories');
        setCategories(response.data);
        const timer = setTimeout(() => {
          setLoading(false);
        }, 3000); // Загрузчик будет виден 3 секунды
  
        // Очистка таймера
        return () => clearTimeout(timer);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Фильтрация статей по выбранной категории
  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Сбрасываем на первую страницу при смене категории
  };

  const filteredArticles = selectedCategory
    ? articles.filter((article) =>
        article.categories.some((cat) => cat.id === selectedCategory)
      )
    : articles;

  // Логика пагинации
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  // Обработка нажатия на кнопку удаления
  const handleDeleteClick = (article: Article, event: React.MouseEvent) => {
    setArticleToDelete(article);
    setShowDeleteModal(true);
  };

  // Подтверждение удаления
  const confirmDelete = () => {
    if (articleToDelete) {
      onDelete(articleToDelete.id);
    }
    closeModal();
  };

  // Закрытие модального окна
  const closeModal = () => {
    setShowDeleteModal(false);
    setArticleToDelete(null);
  };

  // Переход на другую страницу
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Определяем страницы для отображения с учетом многоточий
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage > 3) {
        pages.push(1);
        pages.push('...');

        const startPage = Math.max(2, currentPage - 1);
        const endPage = Math.min(totalPages - 1, currentPage + 1);

        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }

        pages.push('...');
        pages.push(totalPages);
      } else {
        for (let i = 1; i <= 3; i++) {
          pages.push(i);
        }

        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (loading) return  <div>
<p>Загрузка категорий...</p>;
  <Loader />
</div>

  if (error) return <p>Ошибка: {error}</p>;

  return (
    <div className={styles.articleList}>
      {/* Фильтр по категориям */}
      <div>
        <label>Категории:</label>
        <select 
          onChange={(e) => handleCategoryChange(Number(e.target.value))}
          value={selectedCategory || ''}
        >
          <option value="">Все категории</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <h2>Список статей</h2>
      <ul>
        {/* Отображаем только статьи для текущей страницы */}
        {currentArticles.map((article) => (
          <li key={article.id}>
            <strong>{article.title}</strong> — Автор: {article.username}
            <div className={styles.buttonGroup}>
              <button className={styles.button} onClick={() => onEdit(article.id)}>Редактировать</button>
              <button className={styles.button} onClick={(e) => handleDeleteClick(article, e)}>Удалить</button> {/* Передаем событие клика */}
            </div>
            {/* Модальное окно для подтверждения удаления */}
            {showDeleteModal && articleToDelete?.id === article.id && (
              <DeleteModal
                onConfirm={confirmDelete}
                onCancel={closeModal}
                articleTitle={articleToDelete.title}
              />
            )}
          </li>
        ))}
      </ul>

      {/* Пагинация */}
      <div className={styles.pagination}>
        <button
          className={styles.arrowButton}
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          &laquo; {/* Стрелка влево */}
        </button>

        {/* Кнопки для страниц */}
        {getPageNumbers().map((page, index) =>
          typeof page === 'number' ? (
            <button
              key={index}
              className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ) : (
            <span key={index} className={styles.ellipsis}>
              {page}
            </span>
          )
        )}

        <button
          className={styles.arrowButton}
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          &raquo; {/* Стрелка вправо */}
        </button>
      </div>
    </div>
  );
};

export default ArticleList;
