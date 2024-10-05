import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './searchResultsPage.module.css';

interface SearchItem {
  id: number;
  title: string;
  description: string;
  group: string;
  content: string;
}



const SearchResultsPage = () => {
 
  const navigate = useNavigate(); // Хук для навигации
  const handleItemClick = (id: number) => {
    navigate(`/article/${id}`); // Переход на страницу статьи
  };
  const location = useLocation();
  const state = location.state as { searchResults: SearchItem[] } | undefined;
  const results = state?.searchResults || []; 
  const [categories, setCategories] = useState<string[]>([]);
  const handleCategoriesChange = (categories: { id: number, name: string }[]) => {
    setCategories(categories.map(cat => cat.name));
  };

  return (
    <div className={styles.resultsContainer}>
      {results.length === 0 ? (
        <p>Нет результатов для отображения.</p>
      ) : (
        results.map((item) => (
          <div key={item.id} className={styles.resultItem} onClick={() => handleItemClick(item.id)}>
            <Link to={`/article/${item.id}`} className={styles.link}></Link>
            <h4>{item.title}</h4>
            <p>{item.description}</p>
          </div>
          
        ))
      )}
    </div>
  );
};

export default SearchResultsPage;
