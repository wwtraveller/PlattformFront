import React from 'react';
import styles from './contact.module.css';

export default function Contact() {
  return (
    <div className={styles.contactSection}>
      {/* Контейнер для фото и текста */}
      <div className={styles.photoAndText}>
        {/* Фото */}
        <div className={styles.photoContainer}>
          <img src="/media/me4.png" alt="photo" className={styles.photo} />
        </div>

        {/* Описание */}
        <div className={styles.textContainer}>
          {/* <h1>About me</h1> */}
          <p>Привет, дорогой читатель этого сайта!</p>
          <br />
          <ul className={styles.about}>
            <li>Автор этого сайта, а также премиальной программы для экспертов</li>
            <li>Приглашенный онлайн-тренер на бизнес обучении</li>
            <li>Разработчик онлайн-пространств и проектных офисов в Notion</li>
          </ul>
        </div>
      </div>

      {/* Контакты */}
      <div className={styles.contactInfo}>
        <h3>Напиши мне</h3>
        <p>Если есть вопросы, просто напиши мне. Я всегда рада помочь!</p>
        <ul>
          <li>Email: <a href="mailto:your.email@example.com">your.email@example.com</a></li>
          <li>LinkedIn: <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer">LinkedIn Profile</a></li>
          <li>GitHub: <a href="https://github.com/yourprofile" target="_blank" rel="noopener noreferrer">GitHub Profile</a></li>
          <li>Telegram: <a href="https://t.me/yourusername" target="_blank" rel="noopener noreferrer">@yourusername</a></li>
        </ul>
      </div>
    </div>
  );
}


