import { useLocation, useNavigate  } from 'react-router-dom';
import styles from './search.module.css';
import Button from 'components/button/Button';




const SearchErrorPage = () => {
  const location = useLocation();
  const error = location.state?.error as string || ''; //Неизвестная ошибка
  const navigate = useNavigate();
  const handleGoHome = () => {
    navigate('/'); // Переход на главную страницу
  };
  return (
    <div className={styles.container} >  
      <h4>Ошибка:</h4>
      <p className={styles.errorText}>{error}</p>
<Button name="Вернуться на главную" onClick={handleGoHome} />
      
      {/*<Link to="/" className={styles.backLink}>Вернуться на главную</Link>  */}
    </div>
  );
};

export default SearchErrorPage;
