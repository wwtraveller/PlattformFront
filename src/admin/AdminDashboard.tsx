import styles from './admin.module.css';

const AdminDashboard = () => {
  return (
    <div className={styles.dashboard}>
      <h1>Панель администратора</h1>
      <p>Добро пожаловать в админ-панель. Здесь вы можете управлять сайтом.</p>
      {/* Можете добавить виджеты с данными о пользователях, новых статьях и т.д. */}
    </div>
  );
};

export default AdminDashboard;
