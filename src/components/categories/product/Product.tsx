// import React from 'react'

// export default function Product() {
//   return (
//     <h2>Product</h2>


//   )
// }

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from 'redux/hooks'; // Хук для проверки авторизации
import styles from './products.module.css';
import ButtonLogReg from 'components/button/ButtonLogReg';

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
    shortDescription: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sequi laboriosam ab voluptate cupiditate temporibus eaque incidunt tempore alias tempora id. Quisquam perspiciatis veritatis corporis quibusdam dolorem praesentium id, illo animi, ex saepe maxime neque? Optio iste distinctio id perferendis voluptatem sunt doloribus non reprehenderit itaque maxime perspiciatis molestiae modi obcaecati ipsa eaque delectus, deleniti iure a sequi iusto similique culpa mollitia cupiditate quaerat! Ex aliquam repudiandae dolore excepturi sed nostrum architecto culpa quod doloremque, tenetur neque temporibus obcaecati fugiat ullam saepe, quo amet laborum dicta autem accusamus sit at eaque, beatae unde! Iure veniam, voluptatum beatae deserunt sapiente ab quaerat!',
    imageUrl: 'https://img.freepik.com/free-photo/group-of-business-people-having-a-meeting_53876-146155.jpg?size=626&ext=jpg&ga=GA1.1.1413502914.1726012800&semt=ais_hybrid',
    fullText: "",
  },
  {
    id: 2,
    title: 'Ценообразование на инфопродукты и услуги. 8 критериев, которые влияют на цену',
    shortDescription: 'Критерий 1: Громко смейся. Критерий 2: Смотри Шаг 1. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sequi laboriosam ab voluptate cupiditate temporibus eaque incidunt tempore alias tempora id. Quisquam perspiciatis veritatis corporis quibusdam dolorem praesentium id, illo animi, ex saepe maxime neque? Optio iste distinctio id perferendis voluptatem sunt doloribus non reprehenderit itaque maxime perspiciatis molestiae modi obcaecati ipsa eaque delectus, deleniti iure a sequi iusto similique culpa mollitia cupiditate quaerat! Ex aliquam repudiandae dolore excepturi sed nostrum architecto culpa quod doloremque, tenetur neque temporibus obcaecati fugiat ullam saepe, quo amet laborum dicta autem accusamus sit at eaque, beatae unde! Iure veniam, voluptatum beatae deserunt sapiente ab quaerat!',
    imageUrl: 'https://st2.depositphotos.com/4152719/8388/i/450/depositphotos_83882536-stock-photo-competitive-pricing-concept-image-with.jpg',
    fullText: 'Подробная информация о ценообразовании на инфопродукты...',
  },
  
];

export default function Products() {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.user); // Проверяем авторизован ли пользователь

  const handleLoginSuccess = () => {
    navigate('/'); // Перенаправляем на страницу после логина
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
              <Link to={`/articles/${article.id}`} className={styles.readMoreLink}>
                Читать далее
              </Link>
            ) : (
              <div className={styles.authAction}>
                <p>Для полного прочтения статьи войдите в систему</p>
                <ButtonLogReg onLoginSuccess={handleLoginSuccess} className={styles.buttonRight} />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
