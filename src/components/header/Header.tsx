import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './header.module.css';
import { guestLinks } from './links'; // Используем только guestLinks для незарегистрированных пользователей
import { useState } from 'react';
import UserMenu from '../user/UserMenu'; // Подключаем меню пользователя
import AdminMenu from 'admin/AdminMenu'; // Подключаем меню админа
import Search from 'components/search/Search';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { logoutUser } from 'features/auth/authSlice';
import ParentComponent from 'components/search/ParentComponent';
import Button from 'components/button/Button';
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

  const handleLogout = () => {
    // чистим браузерное хранилище данных
    localStorage.removeItem('user-accessToken')
    // чистим state, выносим 'мусор' данных за пользователем
    dispatch(logoutUser());
    navigate('/');
  };


  const handleLoginSuccess = () => {
 // Здесь можно обновить состояние или сделать перенаправление при успешной авторизации
  };

const [categories, setCategories] = useState<string[]>([]);
  return (
    <header className={styles.header}>
      <div className={styles.navMenu}>
        <div className={styles.navLeft}>
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
            
          {/* Если пользователь авторизован, отображаем меню в зависимости от роли */}
          {user?.username && (
            <>
              {user.roles.some((role) => role.authority === 'ROLE_ADMIN') ? (
                <AdminMenu /> // Для админов
              ) : (
                <UserMenu /> // Для зарегистрированных пользователей
              )}
            </>
          )}
        </div>

        {/* Справа: Поиск, имя пользователя и кнопка Войти/Выйти */}
        <div className={styles.navRight}>
          <ParentComponent /> {/* Компонент поиска */}
          
          {/* Если пользователь авторизован, показываем его имя и кнопку "Выйти" */}
          {user?.username ? (
            <>
              <Link to="/profile">
                <div className={styles.userInfo}>
                  {user.photo ? (
                    <img
                      src={user.photo || '/default-avatar.png'}
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
            <ButtonLogReg onLoginSuccess={handleLoginSuccess} />
          )}
        </div>
      </div>
    </header>
  );
}