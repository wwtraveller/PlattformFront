// components/auth/buttonLogReg.tsx
import React, { useState } from 'react';
import Button from 'components/button/Button';
import AuthWindow from 'components/authWindow/AuthWindow';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { showModal, hideModal } from 'features/auth/modalWindowSlice';
import { logoutUser } from 'features/auth/authSlice';
import styles from './buttonLogReg.module.css';

export default function ButtonLogReg() {
    const dispatch = useAppDispatch();
    const { isOpen, type } = useAppSelector((state) => state.modalWindow);
    const [isLoginWindowOpen, setIsLoginWindowOpen] = useState(false);

  const handleOpenLoginWindow = () => {
    dispatch(showModal('/login'));
    setIsLoginWindowOpen(true);
  };

  const handleCloseLoginWindow = () => {
    dispatch(hideModal());
    setIsLoginWindowOpen(false);
  };


  return (
        <>
          <Button name="Войти" onClick={handleOpenLoginWindow} />
          {isLoginWindowOpen && (
            <div className={styles.loginWindow} onClick={handleCloseLoginWindow}>
              <div
                className={styles.loginWindowContent}
                onClick={(e) => e.stopPropagation()}>
                <button
                  className={styles.closeButton}
                  onClick={handleCloseLoginWindow}>
                  ❌
                </button>
                <AuthWindow />
              </div>
            </div>
          )}
        </>
  );
};


