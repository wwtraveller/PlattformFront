import React from 'react';
import styles from './underConstruction.module.css';
import { Link } from 'react-router-dom';

const UnderConstruction = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Скоро здесь будет что-то интересное!</h1>
        <p>
          Мы активно работаем над этой страницей, чтобы предложить вам уникальные материалы и
          инструменты. Наша платформа призвана помочь экспертам, коучам, предпринимателям и
          специалистам в их профессиональном развитии. Следите за обновлениями — совсем скоро
          здесь появятся новые возможности!
        </p>
        <p>Хотите узнать больше о нас? Переходите на <Link to="/">главную страницу</Link> или подпишитесь на наши новости!</p>
        <Link to="/" className={styles.button}>Вернуться на главную</Link>
      </div>
    </div>
  );
};

export default UnderConstruction;
