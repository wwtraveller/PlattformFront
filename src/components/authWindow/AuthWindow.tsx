import React, { useState } from "react";
import styles from "./authWindow.module.css";
import Login from "../login/Login";
import Registration from "../registration/Registration";
import Button from "components/button/Button";
import { FaFacebook, FaGoogle, FaInstagram, FaTwitter, FaVk } from "react-icons/fa"; // Импортируем иконки

export default function AuthWindow() {
  const [isLoginActive, setIsLoginActive] = useState(true);

  const handleSwitch = () => setIsLoginActive(!isLoginActive);

  const handleSocialLogin = (platform: string) => {
    console.log(`Вход через ${platform}`);
  };

  return (
    <div className={styles.authContainer}>
      <div
        className={`${styles.authSectionLog} ${isLoginActive ? styles.showLogin : ""}`}
      >
        <h2>Войти</h2>
        
        {/* Социальные сети для логина */}
        <div className={styles.socialLogin}>
          <div className={styles.socialIcons}>
            <FaGoogle
              className={styles.icon}
              onClick={() => handleSocialLogin("Google")}
            />
            <FaFacebook
              className={styles.icon}
              onClick={() => handleSocialLogin("Facebook")}
            />
            <FaTwitter
              className={styles.icon}
              onClick={() => handleSocialLogin("Twitter")}
            />
            <FaVk
            className={styles.icon}
            onClick={() => handleSocialLogin("Vk")}
            />
          </div>
        </div>
        <Login /> {/* Форма логина */}
      </div>

      {/* Кнопка и текст для переключения */}
      <div className={styles.overlayContainer}>
        <div
          className={`${styles.overlay} ${isLoginActive ? styles.rightPanelActive : ""}`}
        >
          {isLoginActive ? (
            <div className={styles.overlayContent}>
              <h2>Нет аккаунта?</h2>
              <p>Зарегистрируйтесь для доступа к полной информации</p>
              <Button
                onClick={handleSwitch}
                type="submit"
                name="Зарегистрироваться"
              />
            </div>
          ) : (
            <div className={styles.overlayContent}>
              <h2>Уже есть аккаунт?</h2>
              <p>Войдите, чтобы продолжить</p>
              <Button onClick={handleSwitch} type="submit" name="Войти" />
            </div>
          )}
        </div>
      </div>

      <div
        className={`${styles.authSectionSign} ${!isLoginActive ? styles.showRegistration : ""}`}
      >
        <h2>Регистрация</h2>

        <div className={styles.socialLogin}>
          <div className={styles.socialIcons}>
            <FaGoogle
              className={styles.icon}
              onClick={() => handleSocialLogin("Google")}
            />
            <FaFacebook
              className={styles.icon}
              onClick={() => handleSocialLogin("Facebook")}
            />
            <FaTwitter
              className={styles.icon}
              onClick={() => handleSocialLogin("Twitter")}
            />
            <FaVk
            className={styles.icon}
            onClick={() => handleSocialLogin("Vk")}
            />
          </div>
        </div>

        <Registration /> {/* Форма регистрации */}        
      </div>
    </div>
  );
}
