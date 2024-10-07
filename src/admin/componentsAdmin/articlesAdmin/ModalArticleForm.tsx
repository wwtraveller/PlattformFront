import React from 'react';
import styles from './modalArticleForm.module.css';

interface ModalArticleFormProps {
    isOpen: boolean;
    onClose: () => void;
    message: string;
}

const ModalArticleForm: React.FC<ModalArticleFormProps> = ({ isOpen, onClose, message }) => {
    console.log('isOpen в ModalArticleForm:', isOpen); // Добавьте логирование здесь
    if (!isOpen) return null; // Если модальное окно не открыто, ничего не рендерим

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h3>{message}</h3>
                <button onClick={onClose}>Закрыть</button>
            </div>
        </div>
    );
};


export default ModalArticleForm;
