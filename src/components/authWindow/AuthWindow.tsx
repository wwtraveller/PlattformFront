import React from 'react';
import styles from './authWindow.module.css';
import LoginForm from 'components/loginForm/LoginForm';

interface AuthWindowProps {
  onClose: () => void;
}

export default function AuthWindow({ onClose }: AuthWindowProps) {
  return (
    <div className={styles.authContainer}>
      <LoginForm onClose={onClose} /> {/* Вызов компонента LoginForm */}
    </div>
  );
}


