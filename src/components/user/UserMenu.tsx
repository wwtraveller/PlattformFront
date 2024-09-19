import React from 'react';
import { Link } from 'react-router-dom';
import { userLinks } from '../header/links'; // Подключаем ссылки
import styles from './userMenu.module.css';

const UserMenu = () => {
  return (
    <nav className={styles.userMenu}>
      {userLinks.map((link, index) => (
        <Link key={index} to={link.pathname}>
          {link.title}
        </Link>
      ))}
    </nav>
  );
};

export default UserMenu;
