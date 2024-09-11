import React, { useState, FC } from 'react';
import styles from './LoginForm.module.css';

// Интерфейс для пропсов компонента
interface LoginFormProps {
  onClose: () => void;
}

const LoginForm: FC<LoginFormProps> = ({ onClose }) => {
  const [isSignIn, setIsSignIn] = useState(true);

  const handleSignInClick = () => {
    setIsSignIn(true);
  };

  const handleSignUpClick = () => {
    setIsSignIn(false);
  };

  return (
    <div className={styles['modal-wrapper']} onClick={onClose}>
      <div
        className={`${styles.container} ${isSignIn ? styles['sign-in-mode'] : styles['sign-up-mode']}`}
        onClick={(e) => e.stopPropagation()} // Остановка всплытия события
      >
        <button className={styles['close-button']} onClick={onClose}>
          ×
        </button>
        <div className={styles['forms-container']}>
          <div className={styles['signin-signup']}>
            <form className={styles['sign-in-form']}>
              <h2 className={styles.title}>Sign In</h2>
              <div className={styles['input-field']}>
                <input type="text" placeholder="Email" />
              </div>
              <div className={styles['input-field']}>
                <input type="password" placeholder="Password" />
              </div>
              <input type="submit" value="Sign In" className={styles.btn} />
              <p>Forgot your password?</p>
            </form>
            <form className={styles['sign-up-form']}>
              <h2 className={styles.title}>Create Account</h2>
              <div className={styles['input-field']}>
                <input type="text" placeholder="Name" />
              </div>
              <div className={styles['input-field']}>
                <input type="text" placeholder="Email" />
              </div>
              <div className={styles['input-field']}>
                <input type="password" placeholder="Password" />
              </div>
              <input type="submit" value="Sign Up" className={styles.btn} />
            </form>
          </div>
        </div>
        <div className={styles['panels-container']}>
          <div className={`${styles.panel} ${styles['left-panel']}`}>
            <div className={styles.content}>
              <h3>Welcome Back!</h3>
              <p>To keep connected with us please login with your personal info</p>
              <button className={`${styles.btn} ${styles.transparent}`} onClick={handleSignInClick}>
                Sign In
              </button>
            </div>
          </div>
          <div className={`${styles.panel} ${styles['right-panel']}`}>
            <div className={styles.content}>
              <h3>Hello, Friend!</h3>
              <p>Enter your personal details and start your journey with us</p>
              <button className={`${styles.btn} ${styles.transparent}`} onClick={handleSignUpClick}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
