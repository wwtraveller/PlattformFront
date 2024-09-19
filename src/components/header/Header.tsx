import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './header.module.css';
import { guestLinks } from './links'; // Используем только guestLinks для незарегистрированных пользователей
import { useState } from 'react';
import Button from 'components/button/Button';
import Search from 'components/search/Search';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { logoutUser } from 'features/auth/authSlice';
import ParentComponent from 'components/search/ParentComponent';
import UserMenu from '../user/UserMenu'; // Правильное подключение UserMenu
import ButtonLogReg from 'components/button/ButtonLogReg';

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
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();


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
  // const { user } = useAppSelector((state) => state.user); // Достаем пользователя из состояния
  // const { user } = useAppSelector(state => state.user);
  // const dispatch = useAppDispatch();

  // const locationLogName = useLocation();

  const handleLogout = () => {
    // чистим браузерное хранилище данных
    localStorage.removeItem('user-accessToken')
    // чистим state, выносим 'мусор' данных за пользователем
    dispatch(logoutUser());
    navigate('/');
  };


  const handleLoginSuccess = () => {
 // Здесь можно обновить состояние или сделать перенаправление
  };

const [categories, setCategories] = useState<string[]>([]);
  return (
    <header className={styles.header}>
      <div className={styles.navMenu}>
        {/* Отображение ссылок для незарегистрированных пользователей */}
        {!user?.username &&
          guestLinks.map((el, index) => (
            <Link
              key={index}
              className={`${styles.navLink} ${
                location.pathname === el.pathname ? styles.active : ''
              }`}
              to={el.pathname}
            >
              {el.title}
            </Link>
          ))}
      </div>
      <div className={styles.navLeft}>

       <ParentComponent/>
       {/*  <Search setError={setError}
          setSearchResults={setSearchResults} categories={categories}/>*/} {/* Вставка компонента поиска */}
       {/* Если пользователь авторизован, показываем кнопку "Выйти", если нет — "Войти" */}
       {/*user.username ? (*/}

       {/*<Search setError={setError} setSearchResults={setSearchResults} />*/}

        {/* Если пользователь авторизован, показываем меню пользователя, если нет — "Войти" */}
        {user?.username ? (
          <>
            <UserMenu /> {/* Отображаем UserMenu для авторизованного пользователя */}
            <Link to="/profile">
              <div className={styles.userInfo}>
                {user.photo ? (
                  <img
                    src={user.photo || "/default-avatar.png"}
                    alt="Default Avatar"
                    className={styles.avatar}
                    width="40"
                    height="40"
                  />
                ) : (
            <span>{user.username}</span>
                )}
                  </div>
            </Link>
            <Button name="Выйти" onClick={handleLogout} />
          </>
        ) : (
          <ButtonLogReg onLoginSuccess={handleLoginSuccess}/>
        )}
      </div>
    </header>
  );
}