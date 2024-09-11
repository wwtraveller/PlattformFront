import { Link, useLocation } from 'react-router-dom';
import styles from './header.module.css';
import { links } from './links';
import { useState } from 'react';
import AuthWindow from '../authWindow/AuthWindow';
import Button from 'components/button/Button';
import Search from 'components/search/Search';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { logoutUser } from 'features/auth/authSlice';

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
  const [isLoginWindowOpen, setIsLoginWindowOpen] = useState(false);

  const handleOpenLoginWindow = () => {
    setIsLoginWindowOpen(true);
  };

  const handleCloseLoginWindow = () => {
    setIsLoginWindowOpen(false);
  };

  const { user } = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    localStorage.removeItem('user-token');
    dispatch(logoutUser());
  };

  return (
    <header className={styles.header}>
      <div className={styles.navMenu}>
        {links.map((el, index) => (
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
        <Search setError={setError} setSearchResults={setSearchResults} />
        {user.username ? (
          <>
            <span>{user.username}</span>
            <Button name="Выйти" onClick={handleLogout} />
          </>
        ) : (
          <>
            <Button name="Войти" onClick={handleOpenLoginWindow} />
            {isLoginWindowOpen && (
              <div
                className={styles.loginWindow}
                onClick={handleCloseLoginWindow}
              >
                <div
                  className={styles.loginWindowContent}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className={styles.closeButton}
                    onClick={handleCloseLoginWindow}
                  >
                    ❌
                  </button>
                  <AuthWindow onClose={handleCloseLoginWindow} />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
}
