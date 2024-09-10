import React from 'react';
import { useLocation } from 'react-router-dom';
import styles from './searchResultsPage.module.css';

interface SearchResult {
  id: number;
  title: string;
  description: string;
}

const SearchResultsPage = () => {
  const location = useLocation();
  const { results, isSearching, hasSearched } = location.state || {
    results: [],
    isSearching: false,
    hasSearched: false
  };

  return (
    <div className={styles.resultsContainer}>
      {isSearching ? (
        <p>Идет поиск...</p>
      ) : hasSearched && results.length === 0 ? (
        <p>Нет результатов для отображения.</p>
      ) : (
        results.map((item: SearchResult) => (
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
