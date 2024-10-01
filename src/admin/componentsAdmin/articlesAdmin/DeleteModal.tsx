import React from 'react';
import styles from './modal.module.css';

interface DeleteModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  articleTitle: string;
}

const DeleteModal = ({ onConfirm, onCancel, articleTitle }: DeleteModalProps) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <p>Вы уверены, что хотите удалить статью? "{articleTitle}"?</p>
        <div className={styles.buttonGroup}>
          <button className={styles.confirmButton} onClick={onConfirm}>Удалить</button>
          <button className={styles.cancelButton} onClick={onCancel}>Отмена</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
