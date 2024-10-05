import React from 'react';
import styles from './homepage.module.css';
import ButtonLogReg from 'components/button/ButtonLogReg';
import { Link, useNavigate } from 'react-router-dom';


const Homepage = () => {

  const navigate = useNavigate();
  const handleLoginSuccess = () => {
    navigate('/articles/${article.id}'); // Перенаправляем на страницу после логина
  };

  return (
    <div className={styles.homepage}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Наша платформа для экспертов</h1>
          <p>Забудьте старые подходы. Теперь у вас есть лучшее место для роста и развития своего бизнеса. Зарегистрируйтесь и получите доступ к уникальным материалам и инструментам уже сегодня.</p>
          {/* <Link to="/register" className={styles.ctaButton}>Регистрация</Link> */}
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
        {/* <Link to="/register" className={styles.ctaButton}>Зарегистрироваться сейчас</Link> */}
        <ButtonLogReg onLoginSuccess={handleLoginSuccess} className={styles.ctaButton} />
      </section>
    </div>
  );
};

export default Homepage;
