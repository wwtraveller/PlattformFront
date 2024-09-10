import React from 'react';
import styles from './authWindow.module.css';
import Login from '../login/Login';
import Registration from 'components/registration/Registration';



export default function AuthWindow() {
  return (
    <div className={styles.authContainer}>
      <div className={styles.authSectionLog}>
        <h2>Login</h2>
        <p>Добро пожаловать вновь, Друг!</p>
        <Login />  {/* Форма логина */}
      </div>
      <div className={styles.authSectionSign}>
        <h2>Sign Up</h2>
        <p>Привет, Друг!</p>
        <p>Ты, наверное, хотел зарегистрироваться?</p>
        <Registration />  {/* Форма регистрации */}
      </div>
    </div>
  );
}