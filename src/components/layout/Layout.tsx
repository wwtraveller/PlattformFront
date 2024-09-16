import { Outlet, useLocation } from 'react-router-dom';
import Footer from '../footer/Footer';
import styles from './layout.module.css';
import Header from '../header/Header';
import { useEffect, useState } from 'react';
import Products from 'components/categories/product/Product';
import AuthWindow from 'components/authWindow/AuthWindow';


interface SearchItem {
  id: number;
  title: string;
  description: string;
  group: string;
}

function Layout() {
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
  //обновление страницы, чтобы ошибка уходила при переходе на главную страницу
    if (location.pathname === '/') {
      setError(null);
    }
  }, [location.pathname]);


  return (

    <div className={styles.page}>
      
      <Header setError={setError} setSearchResults={()=>{}}  />
      <main className={styles.main}>
        {/* сюда вместо outlet приходят все компоненты из вложенных route */}
        <Outlet />
        {/* Показ ошибок поиска как отдельной страницы */}
        {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;