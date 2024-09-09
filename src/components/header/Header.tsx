import { Link, useLocation } from 'react-router-dom';
import styles from './header.module.css';

import { links } from './links';

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

    </header>
  );
}