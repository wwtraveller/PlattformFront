import styles from './button.module.css'

interface IButtonProps {
    name?: string
    type?: 'button' | 'submit' | 'reset'
    onClick?: () => void;
    count?: number;
  }
  
  
  export default function Button({ type='button', onClick, name='default', count }:IButtonProps) {
    return (
      <button type={type} onClick={onClick} className={styles.myButton}>
        {name} {count !== undefined ? count : ''}
      </button>
    );
  }
