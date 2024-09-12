import { Link, useLocation } from 'react-router-dom';
import styles from './header.module.css';
import { links } from './links';
import { useState } from 'react';
import AuthWindow from '../authWindow/AuthWindow';
import Button from 'components/button/Button';
import Search from 'components/search/Search';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { logoutUser } from 'features/auth/authSlice';
import ParentComponent from 'components/search/ParentComponent';

interface SearchItem {
  id: number;
  title: string;
  description: string;
  group: string;
}

interface HeaderProps {
  setError: (message: string | null) => void;
  setSearchResults: (results: SearchItem[]) => void;
}

export default function Header({ setError, setSearchResults }: HeaderProps) {

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


  // забираем данные по user
  const { user } = useAppSelector(state => state.user);

  const dispatch = useAppDispatch()
  // const locationLogName = useLocation();

  const handleLogout = () => {
    // чистим браузерное хранилище данных
    localStorage.removeItem('user-token')
    // чистим state, выносим 'мусор' данных за пользователем
    dispatch(logoutUser())
  }
const [categories, setCategories] = useState<string[]>([]);
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
       <ParentComponent/>
       {/*  <Search setError={setError}
          setSearchResults={setSearchResults} categories={categories}/>*/} {/* Вставка компонента поиска */}
       {/* Если пользователь авторизован, показываем кнопку "Выйти", если нет — "Войти" */}
       {user.username ? (
          <>
            <span>{user.username}</span>
            <div onClick={handleCloseLoginWindow}>
            <Button name="Выйти" onClick={handleLogout} />
            </div>
          </>
        ) : (
          <>
            <Button name="Войти" onClick={handleOpenLoginWindow} />
            {isLoginWindowOpen && (
              <div className={styles.loginWindow} onClick={handleCloseLoginWindow}>
                <div
                  className={styles.loginWindowContent}
                  onClick={(e) => e.stopPropagation()}>
                  <button
                    className={styles.closeButton}
                    onClick={handleCloseLoginWindow}>
                    ❌
                  </button>
                  <AuthWindow />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
}