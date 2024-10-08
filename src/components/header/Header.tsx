import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./header.module.css";
import { adminLinks, guestLinks, userLinks } from "./links";
import { useRef, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { logoutUser } from "features/auth/authSlice";
import ParentComponent from "components/search/ParentComponent";
import Button from "components/button/Button";
import ButtonLogReg from "components/button/ButtonLogReg";
import { RootState } from "redux/store";
import CategoryLink from "components/categories/CategoryLink";

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
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userAvatar = useAppSelector(
    (state: RootState) => state.auth.user.photo
  );
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Логика для гамбургер-меню
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Для анимации
  const hideMenuTimeout = useRef<NodeJS.Timeout | null>(null); // Таймер для скрытия меню


  const handleLogout = () => {
    // чистим браузерное хранилище данных
    localStorage.removeItem("accessToken");
    // чистим state, выносим 'мусор' данных за пользователем
    dispatch(logoutUser());
    navigate("/");
  };

  const handleLoginSuccess = () => {
    // Здесь можно обновить состояние или сделать перенаправление при успешной авторизации
     };

  const handleMouseEnter = () => {
    if (hideMenuTimeout.current) {
      clearTimeout(hideMenuTimeout.current);
    }
    setIsCategoryMenuOpen(true);
  };

  const handleMouseLeave = () => {
    hideMenuTimeout.current = setTimeout(() => {
      setIsCategoryMenuOpen(false);
    }, 300);
  };
  
  const toggleMenu = () => {
    setIsOpen(!isOpen); // Открываем/закрываем меню
    setIsMenuOpen(!isMenuOpen); // Для анимации гамбургера
  };
  
  // Логика для отображения категорий в гамбургер-меню
  const toggleCategoryMenu = () => {
    setIsCategoryMenuOpen(!isCategoryMenuOpen);
  };
  
  // Функция для закрытия меню после перехода по ссылке
  const handleMenuClick = () => {
    setIsOpen(false); // Закрываем гамбургер-меню
    setIsMenuOpen(false); // Отключаем анимацию меню
  };
  
  useEffect(() => {
    if (isOpen) {
      document.querySelector("main")?.classList.add(styles.blurEffect);
    } else {
      document.querySelector("main")?.classList.remove(styles.blurEffect);
    }
  }, [isOpen]);
  
    const links = user?.roles?.some((role) => role.authority === 'ROLE_ADMIN')
    ? adminLinks
    : user?.username
    ? userLinks
    : guestLinks;
  
  return (
    <header className={`w-full md:w-1/2 ${styles.header}`}>
      {/* Иконка меню */}
      {/* <div className={styles.hamburger} onClick={toggleMenu}>
        {isOpen ? '✖' : '☰'}  Иконка меняется на крестик при открытии 
        </div> */}
      {/* Гамбургер-меню для мобильных устройств */}
      <div id="nav-icon" className={`${styles.hamburger} ${isMenuOpen ? styles.open : ""}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      {/* Логотип */}
      <a href="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              className={styles.logo}
            >
              <text x="10" y="53" fontSize="10" fill="currentColor">probusiness24</text>
            </svg>
          </a>

      {/* Меню навигации для больших экранов */}
      {/* <div className={`${styles.navMenu} ${isOpen ? styles.open : ''}`}> */}
      <div className={`${styles.navMenu} ${isOpen ? styles.open : ''}`}>
        <div className={styles.navLeft}>
          {/* Логотип */}
          {/* <a href="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              className={styles.logo}
            >
              <text x="20" y="53" fontSize="10" fill="currentColor">probusiness24</text>
            </svg>
          </a> */}
          {/* Отображение ссылок в зависимости от пользователя */}
          {links.map((el, index) => (
            <div
              key={index}
              className={styles.navLinkContainer}
              onMouseEnter={el.pathname === '/catLinks' ? handleMouseEnter : undefined} // Показ меню при наведении на "Категории"
              onMouseLeave={el.pathname === '/catLinks' ? handleMouseLeave : undefined} // Скрытие меню при уходе мыши
            >
               {el.pathname === '/catLinks' ? (
                  <span
                    className={`${styles.navLink} ${location.pathname === el.pathname ? styles.active : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleMouseEnter();
                    }}
                  >
                    {el.title}
                    <span className={styles.arrow}>
                      {isCategoryMenuOpen ? '⋀' : '⋁'}
                    </span>
                  </span>
                ) : (
                  <Link
                  className={`${styles.navLink} ${location.pathname === el.pathname ? styles.active : ''}`}
                  to={el.pathname}
                  onClick={handleMenuClick}  // Закрываем меню после клика
                >
                  {el.title}
                </Link>
                )}
              {/* Всплывающее меню для "Категории" */}
              {el.pathname === '/catLinks' && isCategoryMenuOpen && (
                <div className={styles.categoryMenu}>
                  <CategoryLink /> {/* Компонент для отображения вложенных категорий */}
                </div>
              )}
            </div>
          ))}
        </div>
          {/* Только кнопки "Войти" и "Поиск" всегда видны */}
        {/* Справа: Поиск, имя пользователя и кнопка Войти/Выйти */}
        <div className={styles.navRight}>
          <ParentComponent /> {/* Компонент поиска */}

          {/* Если пользователь авторизован, показываем его имя и кнопку "Выйти" */}
          {user?.username ? (
            <>
              <Link to="/profile">
                <div className={styles.userInfo}>
                  <img
                    src={user.photo || '/default-FFA-avatar.png'}
                    alt="User Avatar"
                    className={styles.avatar}
                  />
                </div>
              </Link>
              <Button className={styles.buttonLogout} name="Выйти" onClick={handleLogout} />
            </>
          ) : (
          <ButtonLogReg className={styles.buttonLogin} onLoginSuccess={() => {}} />
          )}
        </div>
        </div>
      
      {/* Гамбургер-меню для navLeft (на маленьких экранах) */}
      {isOpen && (
        <div className={styles.burgerMenu}>
          {links.map((el, index) => (
            <Link
              key={index}
              className={`${styles.navLink} ${location.pathname === el.pathname ? styles.active : ""}`}
              to={el.pathname}
              onClick={handleMenuClick} // Закрываем меню после клика
            >
              {el.title}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}