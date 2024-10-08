import React from 'react';
import styles from './footer.module.css';
import { Link } from 'react-router-dom';

const Footer = () => {

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* Первый блок: Вопросы и кнопка WhatsApp */}
        <div className={styles.contactBlock}>
          <h3>Остались вопросы?</h3>
          <p>Напишите нам</p>
          <a
            href="https://wa.me/1234567890"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsappButton}
          >
            Написать в WhatsApp
          </a>
        </div>

        {/* Второй блок: Социальные сети и контактная информация */}
        <div className={styles.socialBlock}>
          <div className={styles.socials}>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <img src="/icons/instagram.png" alt="Instagram" />
            </a>
            <a href="https://t.me" target="_blank" rel="noopener noreferrer">
              <img src="/icons/telegram.png" alt="Telegram" />
            </a>
            <a href="https://vk.com" target="_blank" rel="noopener noreferrer">
              <img src="/icons/vk.png" alt="VK" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <img src="/icons/facebook.png" alt="FB" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <img src="/icons/youtube.png" alt="YouTube" />
            </a>
          </div>
          <div className={styles.contactInfo}>
            <p>ИП NNN</p>
            <p>ИНН: 011101111110</p>
            <p>ОГРН: 111110400083973</p>
          </div>
        </div>

        {/* Третий блок: Навигационные ссылки и юридическая информация */}
        <div className={styles.linksBlock}>
          <Link to="#" onClick={scrollToTop}>Наверх ↑</Link>
          <Link to="#">Публичная оферта</Link>
          <Link to="#">Политика конфиденциальности</Link>
          <Link to="#">Согласие на получение рассылки</Link>
          <Link to="#">Согласие на обработку данных</Link>
          <p>© Все права защищены</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
