import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './searchResultsPage.module.css';
import ButtonLogReg from 'components/button/ButtonLogReg';
import Button from 'components/button/Button';

interface SearchItem {
  id: number;
  title: string;
  description: string;
  group: string;
  content: string;
}

const SearchResultsPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Состояние авторизации
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<string | null>(null); // Куда перенаправить после логина
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { searchResults: SearchItem[] } | undefined;
  const results = state?.searchResults || [];
  const [categories, setCategories] = useState<string[]>([]);

  // Проверка наличия токена при загрузке страницы
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsAuthenticated(true); // Если токен есть, пользователь авторизован
    }
  }, []);

  // Обработка успешного логина
  const handleLoginSuccess = (redirectPath?: string) => {
    setIsAuthenticated(true);
    if (redirectPath) {
      navigate(redirectPath); // Перенаправление на сохранённую статью
    }
  };

  // Обработка клика на статью
  const handleItemClick = (id: number) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      // Если токена нет, сохраняем путь для редиректа после логина
      setRedirectAfterLogin(`/article/${id}`);
    } else {
      navigate(`/article/${id}`); // Если токен есть, переходим сразу
    }
  };

  const handleCategoriesChange = (categories: { id: number, name: string }[]) => {
    setCategories(categories.map(cat => cat.name));
  };

  const handleGoHome = () => {
    navigate('/'); // Перенаправление на главную страницу
  };

  return (
    <div className={styles.resultsContainer}>
      {/* Если есть сохраненный редирект, показываем окно авторизации */}
      {redirectAfterLogin && !isAuthenticated && (
        <div className={styles.authContainer}>
          <p>Для просмотра статьи необходимо авторизоваться:</p>
          <ButtonLogReg
            onLoginSuccess={handleLoginSuccess}
            redirectPath={redirectAfterLogin} // Перенаправление на сохраненный путь после успешного входа
            className={styles.buttonRight}
          />
        </div>
      )}

      {/* Показываем результаты поиска */}
      {results.length === 0 ? (
        <div>
          <p>Нет результатов для отображения.</p>
          {/* Кнопка на главную */}
          <Button name='На главную' onClick={handleGoHome} /> 
        </div>
      ) : (
        results.map((item) => (
          <div key={item.id} className={styles.resultItem} onClick={() => handleItemClick(item.id)}>
            <h4>{item.title}</h4>
            <p>{item.description}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default SearchResultsPage;
