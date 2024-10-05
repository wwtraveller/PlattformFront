import { Outlet, useLocation } from 'react-router-dom';
import Footer from '../footer/Footer';
import styles from './layout.module.css';
import Header from '../header/Header';
import { useEffect, useState } from 'react';
import ScrollToTop from 'components/ScrollToTop';


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
      <ScrollToTop />
      <Header setError={setError} setSearchResults={()=>{}}  />
      <main className={styles.main}>
        {/* сюда вместо outlet приходят все компоненты из вложенных route */}
        <Outlet />
        {/* Показ ошибок поиска как отдельной страницы */}
        {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}
        <a href="/" target="_self" className={styles.iconProfile} rel="noreferrer">
        {/* <i className ="fa-regular fa-bell"></i> */}
        <i className ="fa-solid fa-house"></i>
        </a>
      </main>
      <Footer />
    </div>
  );
}

export default Layout;