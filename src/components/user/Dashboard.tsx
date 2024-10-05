import React from "react";
import { Link } from "react-router-dom";
import styles from "./dashboard.module.css";

const Dashboard: React.FC = () => {
  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>
          Добро пожаловать в личный кабинет
        </h1>
        <p>Здесь вы можете видеть последние обновления и статьи.</p>
      </div>
      <div className={styles.dashboardContent}>
        {/* Карточка Статьи */}
        <div className={styles.dashboardCard}>
          <h2 className={styles.cardTitle}>Статьи</h2>
          <p className={styles.cardContent}>Читать все статьи платформы.</p>
          <Link to="/articlesList" className={styles.cardLink}>
            Перейти к статьям
          </Link>
        </div>
        
        {/* Карточка Профиль */}
        <div className={styles.dashboardCard}>
          <h2 className={styles.cardTitle}>Профиль</h2>
          <p className={styles.cardContent}>
            Редактировать вашу информацию и настройки.
          </p>
          <Link to="/profile" className={styles.cardLink}>
            Редактировать профиль
          </Link>
        </div>
        
        {/* Карточка Избранное */}
        <div className={styles.dashboardCard}>
          <h2 className={styles.cardTitle}>Избранное</h2>
          <p className={styles.cardContent}>Просмотр избранных статей.</p>
          <Link to="/favorites" className={styles.cardLink}>
            Избранные статьи
          </Link>
        </div>
        
        {/* Карточка Уведомления */}
        <div className={styles.dashboardCard}>
          <h2 className={styles.cardTitle}>Уведомления</h2>
          <p className={styles.cardContent}>Просмотр последних уведомлений.</p>
          <Link to="/notifications" className={styles.cardLink}>
            Перейти к уведомлениям
          </Link>
        </div>
        
        {/* Карточка Настройки */}
        <div className={styles.dashboardCard}>
          <h2 className={styles.cardTitle}>Настройки</h2>
          <p className={styles.cardContent}>
            Управление настройками аккаунта.
          </p>
          <Link to="/settings" className={styles.cardLink}>
            Открыть настройки
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
