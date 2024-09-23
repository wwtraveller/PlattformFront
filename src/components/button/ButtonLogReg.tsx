// components/auth/buttonLogReg.tsx
import React, { useState } from "react";
import Button from "components/button/Button";
import AuthWindow from "components/authWindow/AuthWindow";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { showModal, hideModal } from "features/auth/modalWindowSlice";
import styles from "./buttonLogReg.module.css";
import { useNavigate } from "react-router-dom";

interface ButtonLogRegProps {
  className?: string; // Добавляем возможность передать className
  onLoginSuccess: (redirectPath?: string) => void;
  redirectPath?: string;
}

export default function ButtonLogReg({
  className,
  onLoginSuccess,
  redirectPath,
}: ButtonLogRegProps): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isLoginWindowOpen, setIsLoginWindowOpen] = useState(false);

  const handleOpenLoginWindow = () => {
    dispatch(showModal("/login"));
    setIsLoginWindowOpen(true);
  };

  const handleCloseLoginWindow = () => {
    dispatch(hideModal());
    setIsLoginWindowOpen(false);
  };

  const handleLoginSuccess = () => {
    handleCloseLoginWindow();
    if (redirectPath) {
      navigate(redirectPath); // Перенаправляем на указанный путь
    } else {
      navigate('/'); // Перенаправляем на главную, если путь не установлен
    }
    onLoginSuccess(redirectPath);
    onLoginSuccess();
    console.log("Login successful");

    setTimeout(() => {
      navigate("/");
    }, 0);
  };

  return (
    <>
      <Button
        name="Войти"
        onClick={handleOpenLoginWindow}
        className={className}
      />
      {isLoginWindowOpen && (
        <div className={styles.loginWindow} onClick={handleCloseLoginWindow}>
          <div
            className={styles.loginWindowContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeButton}
              onClick={handleCloseLoginWindow}
            >
              ❌
            </button>
            <AuthWindow onLoginSuccess={handleLoginSuccess} />
          </div>
        </div>
      )}
    </>
  );
}
