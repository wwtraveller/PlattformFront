import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './searchResultsPage.module.css';

interface SearchItem {
  id: number;
  title: string;
  description: string;
  group: string;
}



const SearchResultsPage = () => {
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
          <div key={item.id} className={styles.resultItem}>
            <h4>{item.title}</h4>
            <p>{item.description}</p>
          </div>
          
        ))
      )}
    </div>
  );
};

export default SearchResultsPage;
