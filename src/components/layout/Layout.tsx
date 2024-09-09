import { Outlet } from 'react-router-dom';
import Footer from '../footer/Footer';
import styles from './layout.module.css';
import Header from '../header/Header';

function Layout() {
  
  return (

    <div className={styles.page}>
      
      <Header />
      <main className={styles.main}>
        {/* сюда вместо outlet приходят все компоненты из вложенных route */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout