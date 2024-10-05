import React from "react";
import { Link } from "react-router-dom";
import styles from "./sidebar.module.css";

const Sidebar: React.FC = () => {
  return (
    <nav className={styles.sidebar}>
      <ul className={styles.menuList}>
        <li className={styles.menuItem}>
          <Link to="/dashboard">Главная</Link>
        </li>
        <li className={styles.menuItem}>
          <Link to="/profile">Профиль</Link>
        </li>
        <li className={styles.menuItem}>
          <Link to="/notifications">Уведомления</Link>
        </li>
        <li className={styles.menuItem}>
          <Link to="/settings">Настройки</Link>
        </li>
        <li className={styles.menuItem}>
          <Link to="/favorites">Избранное</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
