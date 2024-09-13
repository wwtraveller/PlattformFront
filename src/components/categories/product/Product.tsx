// import React from 'react'

// export default function Product() {
//   return (
//     <h2>Product</h2>


//   )
// }

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from 'redux/hooks'; // Хук для проверки авторизации
import Button from 'components/button/Button'; // Компонент кнопки
import styles from './products.module.css';

interface Article {
  id: number;
  title: string;
  shortDescription: string;
  imageUrl: string;
  fullText: string;
}


const articles: Article[] = [
  {
    id: 1,
    title: 'Пошаговая стратегия, как создать свой продукт или услугу',
    shortDescription: 'Шаг 1: Громко смейся. Шаг 2: Смотри Шаг 1.',
    imageUrl: 'https://img.freepik.com/free-photo/group-of-business-people-having-a-meeting_53876-146155.jpg?size=626&ext=jpg&ga=GA1.1.1413502914.1726012800&semt=ais_hybrid',
    fullText: 'Полная статья о том, как создать свой продукт, услугу...',
  },
  {
    id: 2,
    title: 'Ценообразование на инфопродукты и услуги. 8 критериев, которые влияют на цену',
    shortDescription: 'Критерий 1: Громко смейся. Критерий 2: Смотри Шаг 1.',
    imageUrl: 'https://st2.depositphotos.com/4152719/8388/i/450/depositphotos_83882536-stock-photo-competitive-pricing-concept-image-with.jpg',
    fullText: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nam dicta molestias neque nostrum voluptate iure, inventore quaerat quo velit architecto quam ipsam porro laudantium. Neque delectus fuga ab obcaecati nisi.'
  },
  
];

export default function Products() {

  const { user } = useAppSelector((state) => state.user); // Проверяем авторизован ли пользователь
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/login'); // Редирект на страницу логина
  };

  return (
    <div className={styles.articlesContainer}>
      {articles.map((article) => (
        <div key={article.id} className={styles.article}>
          <img src={article.imageUrl} alt={article.title} className={styles.articleImage} />
          <div className={styles.articleContent}>
            <h3 className={styles.articleTitle}>{article.title}</h3>
            <p className={styles.shortDescription}>{article.shortDescription}</p>
            
            {/* Если пользователь авторизован, показываем полную статью */}
            {user?.username ? (
              <Link to={`/api/articles/${article.id}`} className={styles.readMoreLink}>
                Читать далее
              </Link>
            ) : (
              <div className={styles.authAction}>
                <p>Для полного прочтения статьи войдите в систему</p>
                <Button name="Войти" onClick={handleLoginRedirect} />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
