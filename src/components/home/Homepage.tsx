import React, { useEffect, useState } from 'react';
import styles from './homepage.module.css';
import ButtonLogReg from 'components/button/ButtonLogReg';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from 'redux/hooks';
import { RootState } from 'redux/store';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from 'components/loader/Loader';


const Homepage = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Добавляем состояние загрузки

  useEffect(() => {
    // Если пользователь зарегистрирован, загружаем статьи
    if (user?.username) {
      const fetchArticles = async () => {
        try {
          const response = await axios.get('/api/articles');
          setArticles(response.data);
        } catch (error) {
          toast.error("Ошибка при загрузке статей.");
        } finally {
          setLoading(false); // Устанавливаем загрузку как завершенную
        }
      };

      fetchArticles();
    } else {
      setLoading(false); // Если пользователь не авторизован, отключаем лоадер
    }
  }, [user]);

  const handleLoginSuccess = () => {
    navigate('/articles'); // Перенаправляем на страницу со статьями после логина
  };

  // Контент для незарегистрированных пользователей
  const renderGuestContent = () => (
    <div className={styles.homepage}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Наша платформа для экспертов</h1>
          <p>Забудьте старые подходы. Теперь у вас есть лучшее место для роста и развития своего бизнеса. Зарегистрируйтесь и получите доступ к уникальным материалам и инструментам уже сегодня.</p>
          <ButtonLogReg onLoginSuccess={handleLoginSuccess} className={styles.ctaButton} />
        </div>
        <img src="/media/ExpertsWorking.jpg" alt="Experts working" className={styles.heroImage} />
      </section>

      <section className={styles.trustedBy}>
        <h2>Нам доверяют</h2>
        <div className={styles.trustLogos}>
          <img src="/media/me4.png" alt="fio1" />
          <img src="https://avatars.githubusercontent.com/u/165147653?v=4" alt="fio2" />
          <img src="https://ca.slack-edge.com/T049BEB3UQP-U06M0TQMKML-a58762b0836e-512" alt="fio3" />
        </div>
      </section>

      <section className={styles.features}>
        <h2>Что вы получите на платформе</h2>
        <div className={styles.featuresList}>
          <div className={styles.featureItem}>
            <h3>Личный кабинет эксперта</h3>
            <p>Управляйте своим профилем, следите за прогрессом и взаимодействуйте с другими экспертами прямо на платформе.</p>
          </div>
          <div className={styles.featureItem}>
            <h3>Библиотека статей и шаблонов</h3>
            <p>Получите доступ к эксклюзивным материалам, статьям, шаблонам и инструментам, которые помогут вам развивать свой бизнес.</p>
          </div>
          <div className={styles.featureItem}>
            <h3>Удобный поиск и фильтры</h3>
            <p>Ищите нужные материалы и статьи легко, используя встроенные фильтры по категориям и тегам.</p>
          </div>
        </div>
      </section>

      <section className={styles.callToAction}>
        <h2>Готовы начать?</h2>
        <ButtonLogReg onLoginSuccess={handleLoginSuccess} className={styles.ctaButton} />
      </section>
    </div>
  );

  // Контент для зарегистрированных пользователей
  const renderUserContent = () => (
    <div className={styles.homepage}>
      <section className={styles.articlesSection}>
        <h1>Последние статьи</h1>
        {articles.length > 0 ? (
          <div className={styles.articleGrid}>
            {articles.slice(0, 5).map((article: any) => (
              <div key={article.id} className={styles.articleCard}>
                <Link to={`/articles/${article.id}`}>
                  <h3>{article.title}</h3>
                  <p>{article.category?.name}</p>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p>Пока нет новых статей.</p>
        )}
        <Link to="/articles" className={styles.viewAllButton}>Показать все статьи</Link>
      </section>
    </div>
  );

  // Контент для администраторов
  const renderAdminContent = () => (
    <div className={styles.homepage}>
      <section className={styles.adminPanel}>
        <h1>Панель управления</h1>
        <div className={styles.adminActions}>
          <Link to="/admin/adminarticles" className={styles.ctaButton}>Управление статьями</Link>
          <Link to="/admin/admincategories" className={styles.ctaButton}>Управление категориями</Link>
          <Link to="/userlist" className={styles.ctaButton}>Управление пользователями</Link>
        </div>
        <div className={styles.adminDashboard}>
          <div className={styles.dashboardCard}>
            <h3>Пользователи</h3>
            <p>Всего: 102</p> {/* Пример, можно заменить динамическими данными */}
          </div>
          <div className={styles.dashboardCard}>
            <h3>Категории</h3>
            <p>Всего: 8</p> {/* Пример */}
          </div>
          <div className={styles.dashboardCard}>
            <h3>Статьи</h3>
            <p>Всего: 35</p> {/* Пример */}
          </div>
        </div>
      </section>
    </div>
  );

  // Основная логика отображения контента
  if (loading)
    return (
      <div>
        <h1>Загрузка...</h1>
        <Loader />
      </div>
    );
  if (error) return <p>{error}</p>;

  if (!user?.username) {
    return renderGuestContent(); // Незарегистрированные пользователи
  } else if (user.roles?.some((role) => role.authority === "ROLE_ADMIN")) {
    return renderAdminContent(); // Администраторы
  } else {
    return renderUserContent(); // Зарегистрированные пользователи
  }
};

export default Homepage;
