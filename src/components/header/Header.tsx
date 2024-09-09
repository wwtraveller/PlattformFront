import { Link, useLocation } from 'react-router-dom';
import styles from './header.module.css';

import { links } from './links';
import Button from '../button/Button';

export default function Header() {
  const location = useLocation();

  return (
    <header className={styles.header}>
      {links.map((el, index) => (
        <Link
          key={index}
          className={location.pathname === el.pathname ? styles.active : ''}
          to={el.pathname}>{el.title}</Link>
      ))}
      <div>
        <Link to={'/login'}><Button name='Войти' /></Link>
        <Link to={'/signup'}><Button name='Зарегистрироваться' /></Link>
      </div>

    </header>
  );
}