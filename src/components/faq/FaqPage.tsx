import React from 'react';
import styles from './faqPage.module.css';

interface FaqItem {
  question: string;
  answer: string;
}

const faqData: FaqItem[] = [
    { 
        question: "Что такое эта платформа и для кого она предназначена?", 
        answer: "Наша платформа создана для экспертов, коучей, фрилансеров и специалистов, которые хотят получать доступ к высококачественному образовательному контенту для развития своих профессиональных и личных навыков." 
      },
  { 
    question: "Как зарегистрироваться на платформе?", 
    answer: "Перейдите на страницу регистрации и заполните форму с вашими данными. После этого вам придет подтверждение на почту." 
  },
  { 
    question: "Могу ли я использовать платформу бесплатно?", 
    answer: "Да, вы можете просматривать часть контента бесплатно. Для доступа к полным версиям статей, чек-листам и шаблонам потребуется оформить регистрацию." 
  },
  { 
    question: "Какие материалы доступны бесплатно?", 
    answer: "Часть статей и материалов доступны для всех пользователей. Чтобы получить полный доступ к контенту, вам нужно оформить подписку." 
  },
  { 
    question: "Как связаться с поддержкой?", 
    answer: "Вы можете написать в нашу службу поддержки через WhatsApp, по ссылке внизу страницы." 
  }
];

const FaqPage: React.FC = () => {
  return (
    <div className={styles.faqPage}>
      <h1 className={styles.title}>Часто задаваемые вопросы</h1>
      <ul className={styles.faqList}>
        {faqData.map((item, index) => (
          <li key={index} className={styles.faqItem}>
            <h2 className={styles.question}>{item.question}</h2>
            <p className={styles.answer}>{item.answer}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FaqPage;
