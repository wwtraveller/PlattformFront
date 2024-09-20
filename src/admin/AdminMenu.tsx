import React from 'react';
import { Link } from 'react-router-dom';
import { adminLinks } from 'components/header/links'; // Подключаем ссылки
import styles from './adminMenu.module.css';

const AdminMenu = () => {
  return (
    <nav className={styles.adminMenu}>
      {adminLinks.map((link, index) => (
        <Link key={index} to={link.pathname}>
          {link.title}
        </Link>
      ))}
    </nav>
  );
};

export default AdminMenu;
