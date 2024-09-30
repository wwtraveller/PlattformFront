import React from 'react';
import { Link } from 'react-router-dom';
import styles from './dashboard.module.css';

const Dashboard: React.FC = () => {
  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>Добро пожаловать в личный кабинет</h1>
        <p>Здесь вы можете видеть последние обновления и статьи.</p>
      </div>
      <div className={styles.dashboardContent}>
        <div className={styles.dashboardCard}>
          <h2 className={styles.cardTitle}>Статьи</h2>
          <p className={styles.cardContent}>Читать все статьи платформы.</p>
          <Link to="/articlesList" className={styles.cardLink}>Перейти к статьям</Link>
        </div>
        <div className={styles.dashboardCard}>
          <h2 className={styles.cardTitle}>Профиль</h2>
          <p className={styles.cardContent}>Редактировать вашу информацию и настройки.</p>
          <Link to="/profile" className={styles.cardLink}>Редактировать профиль</Link>
        </div>
        <div className={styles.dashboardCard}>
          <h2 className={styles.cardTitle}>Избранное</h2>
          <p className={styles.cardContent}>Просмотр избранных статей.</p>
          <Link to="/favorites" className={styles.cardLink}>Избранные статьи</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
