import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./search.module.css";
import "remixicon/fonts/remixicon.css";
import Select from 'react-select';
import { SingleValue, ActionMeta } from 'react-select';


interface SearchItem {
  id: number;
  title: string;
  description: string;
  group: string;
  content: string;
}

interface SearchProps {
  setError: (message: string | null) => void;
  setSearchResults: (results: SearchItem[]) => void;
  categories: string[];
}

const SearchFilter = ({ items, query }: { items: SearchItem[]; query: string }) => {
  // Фильтруем элементы на основе введённого текста
  const filteredItems = items.filter(
    (item) =>
      item.title?.toLowerCase().includes(query.toLowerCase()) ||
      item.description?.toLowerCase().includes(query.toLowerCase())
  );

  // Отображаем отфильтрованные элементы
  return (
    <div className={styles.filteredResults}>
      {query.trim() && filteredItems.length === 0 ? (
        <p></p>
      ) : (
        filteredItems.map((item) => (
          <div
            key={item.id}
            className={styles.searchItem}
          >
            <h3></h3>
            <p></p>
          </div>
        ))
      )}
    </div>
  );
};

const Search = (props: SearchProps) => {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<{ value: string; label: string } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false); // Флаг, что был выполнен поиск
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<SearchItem[]>([]); // Данные для фильтрации
  const [filteredItems, setFilteredItems] = useState<SearchItem[]>([]); // Результаты live-фильтрации
  const [isExpanded, setIsExpanded] = useState(false); // Добавляем состояние для управления расширением поиска

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) {
          throw new Error("Ошибка при загрузке категорий");
        }
        const data = await response.json();
        console.log("Fetched Categories:", data);
        // Извлекаем названия категорий из объектов
        const categoryNames = data.map((item: { name: string }) => item.name);
        setCategories(categoryNames);
      } catch (error) {
        console.error("Ошибка при получении категорий:", error);
        setError("Не удалось загрузить категории");
      }
    };

    fetchCategories();
  }, []);

  const navigate = useNavigate(); // Хук для навигации

  const validateSearch = () => {
    if (!query.trim()) {
      props.setError("");
      navigate("/search-error", {
        state: { error: "Пожалуйста, введите строку поиска." },
      });
      return false;
    }

    props.setError(null); // Сброс ошибки, если все условия выполнены
    return true;
  };

  const handleSearch = async () => {
    if (!validateSearch()) {
      setQuery(""); // Очистка запроса при ошибке
      setGroup(null);
      return;
    }
  
    setIsSearching(true);
    try {
      // Формируем URL для запроса
      let apiUrl = '';
  
      // Проверяем, выбрана ли категория
      if (group && group.value) {
        // Используем эндпоинт с категорией и поисковым запросом
        apiUrl = `/api/categories/findarticles?name=${encodeURIComponent(group.value)}&title=${encodeURIComponent(query)}`;
      } else {
        // Используем эндпоинт только с поисковым запросом
        apiUrl = `/api/categories/findarticles?title=${encodeURIComponent(query)}`;
      }
  
      const response = await fetch(apiUrl);
  
      // Проверка, что запрос завершился успешно
      if (!response.ok) {
        throw new Error("Ошибка при выполнении запроса к серверу");
      }
  
      // Получаем данные из ответа сервера в формате JSON
      const filteredResults = await response.json();
      
      props.setSearchResults(filteredResults); // Сохраняем результаты поиска
      setItems(filteredResults);
      setHasSearched(true);
      navigate("/search-results", {
        state: { searchResults: filteredResults },
      });
    } catch (error) {
      console.error("Ошибка:", error);
      props.setError("");
      navigate("/search-error", {
        state: { error: "Ошибка при выполнении поиска. Попробуйте снова." },
      });
    } finally {
      setIsSearching(false);
      setQuery("");
      setGroup(null);
    }
  };
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  
    // Реализуем live-фильтрацию на основе обновлённого query
    if (items.length > 0) {
      const filtered = items.filter((item) => {
        const titleMatch = item.title?.toLowerCase().includes(e.target.value.toLowerCase());
        const descriptionMatch = item.description?.toLowerCase().includes(e.target.value.toLowerCase());
        return titleMatch || descriptionMatch; // Возвращаем результат фильтрации
      });
      setFilteredItems(filtered);
    }
  };
  

  const handleGroupChange = (newValue: SingleValue<{ value: string; label: string }>, actionMeta: ActionMeta<{ value: string; label: string }>) => {
    if (newValue) {
    setGroup(newValue);
    if (newValue.value === "Все категории") {
      setGroup(null); // Сбрасываем выбор категории, чтобы вернуться к "Все категории"
    } else {
      props.setError(null);// Сбрасываем ошибку, если категория выбрана
    }
  }
  };

  const handleSearchClick = () => {
    // Если поиск еще не развернут, разворачиваем его
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
      // Вызов логики для поиска
      // Логика поиска
    }
  };

  const handleSearchToggle = () => {
    setIsExpanded(!isExpanded); // Логика переключения состояния (свернуто/развернуто)
  };

  const handleCategoryChange = (updatedCategories: string[]) => {
    setCategories(updatedCategories); // Обновляем локальные категории
    //console.log('Updated Categories:', updatedCategories);
  };
  

  const options = categories.map((category: string) => ({
    value: category,
    label: category.charAt(0).toUpperCase() + category.slice(1)
  }));

  return (
    <div className={styles.search_container}>
      {/* <div className={`${styles.search_input_wrapper} ${isExpanded ? styles.expanded : ""}`}> */}
      <div className={styles.search_input_wrapper}>
        {/* <div className={styles.icon_search}> */}
        {/* Кнопка-лупа для сворачивания/разворачивания */}
        <button type="button" className={styles.search_button_icon} onClick={handleSearchToggle}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            aria-hidden="true"
            viewBox="0 0 24 24"
            role="img"
          >
            <path
              vectorEffect="non-scaling-stroke"
              stroke="var(--icon-color, #001e00)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeMiterlimit="10"
              strokeWidth="1.5"
              d="M10.688 18.377a7.688 7.688 0 100-15.377 7.688 7.688 0 000 15.377zm5.428-2.261L21 21"
            ></path>
          </svg>
          {/* <i className="fas fa-search"></i> */}
        </button>
        {/* Скрываем поиск и категории на маленьких экранах, пока не нажали на лупу */}
        {isExpanded && (
          <>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Поиск"
          className={styles.search_input}
          
        />
      
      <div className={styles.separator}></div>

      <div className={styles.category_container}>
        <Select
          value={group}
          onChange={handleGroupChange}
          options={options}
          placeholder="Все категории"
          className={styles.select_categories}
          styles={{
            control: (provided, state) => ({
              ...provided,
              backgroundColor: state.isFocused ? '#ffffffb2' : 'transparent',
              border: state.isFocused ? '1px solid #007bff' : '2px solid transparent',
              borderRadius: '40px',
              height: '35px',
              transition: 'border 0.3s ease',
              width: '130px',

              '&:hover': {
                backgroundColor: state.isFocused ? '#00000023' : '#ffffffb2',
                color: '#fff',
              },
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: '#ffffff',
              color: '#000000',
              '&:hover': {
                backgroundColor: '#007bff',
                color: '#fff',
            },
          }),
          }}
        />
      </div>
      </>
      )}
      </div>
      <SearchFilter items={items} query={query} />
    </div>
  );
};

export default Search;