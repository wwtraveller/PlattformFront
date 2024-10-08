import React from 'react';
import styles from './modal.module.css';

interface DeleteModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  articleTitle?: string;
  style?: React.CSSProperties;
}

const DeleteModal = ({ onConfirm, onCancel, articleTitle, style }: DeleteModalProps) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal} style={style}>
        <p>Вы уверены, что хотите удалить статью?</p>
        <div className={styles.buttonGroup}>
          <button className={styles.confirmButton} onClick={onConfirm}>Да</button>
          <button className={styles.cancelButton} onClick={onCancel}>Отмена</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
