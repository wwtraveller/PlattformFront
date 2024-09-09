import { Link, useLocation } from 'react-router-dom';
import styles from './header.module.css';
import { links } from './links';
import { useState } from 'react';
import Login from '../login/Login';
import Button from '../button/Button';
import Search from 'components/search/Search';



export default function Header() {
  const location = useLocation();
  // const [searchQuery, setSearchQuery] = useState(''); // Состояние для хранения запроса
  const [isLoginWindowOpen, setIsLoginWindowOpen] = useState(false);

const handleOpenLoginWindow = () => {
  setIsLoginWindowOpen(true);
};

const handleCloseLoginWindow = () => {
  setIsLoginWindowOpen(false);
};

  // Функция обработки изменения ввода
  // const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  // setSearchQuery(event.target.value);
  // };

  // Функция запуска поиска по нажатию Enter
  // const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (event.key === 'Enter') {
  //     console.log(`Поиск по запросу: ${searchQuery}`);
  //     // Добавить логику для выполнения поиска, запрос к API
  //     setSearchQuery(''); // Очистка поля поиска после запуска
  //   }
  // };

  // Функция, которая будет вызвана при нажатии на кнопку поиска
  // const handleSearch = () => {
  // console.log(`Поиск по запросу: ${searchQuery}`);
  // Здесь можно добавить логику для выполнения поиска, например, сделать запрос к API
  //};

  return (
    <header className={styles.header}>
      <div className={styles.navMenu}>
      {links.map((el, index) => (
        <Link
          key={index}
          className={`${styles.navLink} ${
            location.pathname === el.pathname ? styles.active : ''}`}
          to={el.pathname}>{el.title}</Link>
      ))}
      </div>
      <div className={styles.navLeft}>
        <Search /> {/* Вставка компонента поиска */}
        <div>
            <Button name='Войти' onClick={handleOpenLoginWindow} />
            {isLoginWindowOpen && (
              <div className={styles.loginWindow}>
                <div className={styles.loginWindowContent}>
                   <button className={styles.closeButton} onClick={handleCloseLoginWindow}>Закрыть</button>
                  <Login />
                </div>
              </div>
            )}
        </div>
        
        <Link to={'/signup'} className={styles.signupButton}><Button name='Зарегистрироваться' /></Link>
        
      </div>

    </header>
  );
}