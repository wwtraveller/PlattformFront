import React from 'react';
import styles from './modal.module.css'; // Подключаем стили для модального окна

interface ModalProps {
  isOpen: boolean; // Флаг для управления отображением модального окна
  title: string; // Заголовок модального окна
  onClose: () => void; // Функция для закрытия модального окна
  onConfirm: () => void; // Функция для подтверждения действия
  children: React.ReactNode; // Содержимое окна
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, onClose, onConfirm, children }) => {
  if (!isOpen) return null; // Если окно закрыто, ничего не рендерим

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{title}</h2>
        <div className={styles.modalBody}>
          {children}
        </div>
        <div className={styles.modalActions}>
          <button onClick={onClose} className={styles.modalButtonCancel}>Отменить</button>
          <button onClick={onConfirm} className={styles.modalButtonConfirm}>Удалить</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
