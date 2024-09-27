import styles from './button.module.css'

interface IButtonProps {
    name?: string
    type?: 'button' | 'submit' | 'reset'
    onClick?: () => void;
    count?: number;
    className?: string;
    children?: React.ReactNode;
  }
  
  
  export default function Button({ type='button', onClick, name='default', count, className, children }:IButtonProps): JSX.Element {
    return (
      <button type={type} onClick={onClick} className={`${styles.myButton} ${className || ''}`}>
      {children ? children : name} {count !== undefined ? count : ''}
      </button>
    );
  }
