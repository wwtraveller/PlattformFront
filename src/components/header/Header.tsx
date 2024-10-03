import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./header.module.css";
import { adminLinks, guestLinks, userLinks } from "./links";
import { useRef, useState } from "react";
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
  const hideMenuTimeout = useRef<NodeJS.Timeout | null>(null); // Таймер для скрытия меню


  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    dispatch(logoutUser());
    navigate("/");
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

  const links = user?.roles?.some((role) => role.authority === 'ROLE_ADMIN')
  ? adminLinks
  : user?.username
  ? userLinks
  : guestLinks;

  return (
    <header className={styles.header}>
      <div className={styles.navMenu}>
        <div className={styles.navLeft}>
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
                      {isCategoryMenuOpen ? '▲' : '▼'}
                    </span>
                  </span>
                ) : (
              <Link
                className={`${styles.navLink} ${location.pathname === el.pathname ? styles.active : ''}`}
                to={el.pathname}
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

        <div className={styles.navRight}>
          <ParentComponent /> {/* Компонент поиска */}

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
              <Button name="Выйти" onClick={handleLogout} />
            </>
          ) : (
<ButtonLogReg onLoginSuccess={() => {}} />
          )}
        </div>
      </div>
    </header>
  );
}