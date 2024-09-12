import { Outlet, Link } from 'react-router-dom';
import styles from './admin.module.css';

const AdminLayout = () => {
  return (
    <div className={styles.adminLayout}>
      <nav className={styles.adminNav}>
        <Link to="/admin/dashboard">Главная</Link>
        <Link to="/admin/users">Пользователи</Link>
        <Link to="/admin/categories">Категории</Link>
        <Link to="/admin/articles">Статьи</Link>
        <Link to="/admin/comments">Комментарии</Link>
        <Link to="/admin/subscriptions">Подписки</Link>
        <Link to="/admin/sales-materials">Материалы</Link>
      </nav>
      <main className={styles.adminContent}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
