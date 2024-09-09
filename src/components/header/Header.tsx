import { Link, useLocation } from 'react-router-dom';
import styles from './header.module.css';

import { links } from './links';
import Button from '../button/Button';
import { useState } from 'react';


export default function Header() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState(''); // Состояние для хранения запроса

  // Функция обработки изменения ввода
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setSearchQuery(event.target.value);
  };

  // Функция, которая будет вызвана при нажатии на кнопку поиска
  const handleSearch = () => {
  console.log(`Поиск по запросу: ${searchQuery}`);
  // Здесь можно добавить логику для выполнения поиска, например, сделать запрос к API
  };

  return (
    <header className={styles.header}>
      <div className={styles.navMenu}>
      {links.map((el, index) => (
        <Link
          key={index}
          className={location.pathname === el.pathname ? styles.active : ''}
          to={el.pathname}>{el.title}</Link>
      ))}
      </div>
      <div className={styles.navLeft}>
        {/* Блок для поиска */}
        <div className={styles.navSearch}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Введите запрос"
            className={styles.searchInput} // Добавьте стили по желанию
          />
          <Button type="button" name="Поиск" onClick={handleSearch} />
        </div>
        
        <Link to={'/login'} className={styles.loginButton}><Button name='Войти' /></Link>
        <Link to={'/signup'} className={styles.signupButton}><Button name='Зарегистрироваться' /></Link>
      </div>

    </header>
  );
}