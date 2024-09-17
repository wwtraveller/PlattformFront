import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './search.module.css';
import 'remixicon/fonts/remixicon.css';


interface SearchItem {
  id: number;
  title: string;
  description: string;
  group: string;
}

interface SearchProps {
  setError: (message: string | null) => void;
  setSearchResults: (results: SearchItem[]) => void;
  categories: string[]; 
}

// Новый компонент SearchFilter для отображения и фильтрации результатов
const SearchFilter = ({ items, query }: { items: SearchItem[], query: string }) => {
  // Фильтруем элементы на основе введённого текста
  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.description.toLowerCase().includes(query.toLowerCase())
  );

  // Отображаем отфильтрованные элементы
  return (
    <div className={styles.filteredResults}>
      {query.trim() && filteredItems.length === 0 ? (
        <p></p>
      ) : (
        filteredItems.map(item => (
          <div key={item.id} className={styles.searchItem}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))
      )}
    </div>
  );
};


const Search = (props: SearchProps) => {
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState(''); 
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false); // Флаг, что был выполнен поиск
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<SearchItem[]>([]); // Данные для фильтрации
  const [filteredItems, setFilteredItems] = useState<SearchItem[]>([]); // Результаты live-фильтрации
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFocus = () => {
    setIsExpanded(true);
  };
  
  const handleBlur = () => {
    setIsExpanded(false);
  };

  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('Ошибка при загрузке категорий');
        }
        const data = await response.json();
        console.log('Fetched Categories:', data);
        // Извлекаем названия категорий из объектов
        const categoryNames = data.map((item: { name: string }) => item.name);
        setCategories(categoryNames);
      } catch (error) {
        console.error('Ошибка при получении категорий:', error);
        setError('Не удалось загрузить категории');
      }
    };
  
    fetchCategories();
  }, []);

  const navigate = useNavigate(); // Хук для навигации

  const validateSearch = () => {
    if (!query.trim()) {
      props.setError('');
      navigate('/search-error', { state: { error: 'Пожалуйста, введите строку поиска.' } });
      return false;
    }

    props.setError(null);  // Сброс ошибки, если все условия выполнены
    return true;
  };

  const handleSearch = async () => {
    if (!validateSearch()) {
      setQuery(''); // Очистка запроса при ошибке
      setGroup('');
      return;
    }
    setIsSearching(true); 
    try {
      // Отправка запроса на бэкенд для выполнения поиска
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}&groups=${encodeURIComponent(group)}`);
    
      // Проверка, что запрос завершился успешно
      if (!response.ok) {
        throw new Error('Ошибка при выполнении запроса к серверу');
      }
    
      // Получаем данные из ответа сервера в формате JSON
      const filteredResults = await response.json();

      props.setSearchResults(filteredResults); // Сохраняем результаты поиска
      setItems(filteredResults);
      setHasSearched(true);
      navigate('/search-results', { state: { searchResults: filteredResults } });

    } catch (error) {
      props.setError('');
      navigate('/search-error', { state: { error: 'Ошибка при выполнении поиска. Попробуйте снова.'}});   {/*error: 'Ошибка при выполнении поиска. Попробуйте снова.' */}
    } finally {
      setIsSearching(false);
      setQuery('');
      setGroup('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
 // Реализуем live-фильтрацию на основе обновлённого query
 if (items.length > 0) {
  const filtered = items.filter(item => 
    item.title.toLowerCase().includes(e.target.value.toLowerCase()) ||
    item.description.toLowerCase().includes(e.target.value.toLowerCase())
  );
  setFilteredItems(filtered);
}
};


  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGroup(e.target.value);
    if (e.target.value.trim()) {
      props.setError(null);  // Сбрасываем ошибку, если категория выбрана
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleCategoryChange = (updatedCategories: string[]) => {
    setCategories(updatedCategories);  // Обновляем локальные категории
    //console.log('Updated Categories:', updatedCategories);
  };


  return (
    <div className={`${styles.search} ${isExpanded ? styles.expanded : ''}`}>
      <div className={styles.searchWrapper}>
        <div className={styles.searchIcon}>
        <button type="button" className={styles.searchButton}>
      <i className="ri-search-2-line" >
      </i>
    </button>
    <div className={styles.selectContainer}>
        <select 
          value={group}
          onChange={handleGroupChange}
          className={styles.searchSelect}
        >
         
          <option  value="">Все категории</option>
          
          {categories.map((category) => (
          <option key={category} value={category}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </option>
        ))}
        
        </select>
        </div>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Поиск"
          className={styles.searchInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        
    </div>
      </div>
      <SearchFilter items={items} query={query} />
    </div>
  );
};

export default Search;