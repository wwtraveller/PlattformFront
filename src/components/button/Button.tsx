import styles from './button.module.css'

interface IButtonProps {
    name?: string
    type?: 'button' | 'submit' | 'reset'
    onClick?: () => void;
    count?: number;
    className?: string;
  }
  
  
  export default function Button({ type='button', onClick, name='default', count, className }:IButtonProps): JSX.Element {
    return (
      <button type={type} onClick={onClick} className={`${styles.myButton} ${className || ''}`}>
        {name} {count !== undefined ? count : ''}
      </button>
    );
  }
