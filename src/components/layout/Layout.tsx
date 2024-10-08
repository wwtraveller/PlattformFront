import { Outlet, useLocation } from 'react-router-dom';
import Footer from '../footer/Footer';
import styles from './layout.module.css';
import Header from '../header/Header';
import { useEffect, useState } from 'react';
import ScrollToTop from 'components/ScrollToTop';
import Banner from 'components/banner/Banner';


interface SearchItem {
  id: number;
  title: string;
  description: string;
  group: string;
}

function Layout() {
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const [bannerText, setBannerText] = useState('');
  const [backgroundImage, setBackgroundImage] = useState('');


  useEffect(() => {
    const pathParts = location.pathname.split('/'); // Разделяем путь
    const categoryName = decodeURIComponent(pathParts[pathParts.length - 1]);

  switch (location.pathname) {
    // case '/':
    //   setBannerText('Добро пожаловать на главную страницу!');
    //   setBackgroundImage('https://images.pexels.com/photos/164652/pexels-photo-164652.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'); // Укажите URL изображения для главной страницы
    //   break;
    case '/about':
      setBannerText('Наши технологии и команда');
      setBackgroundImage('https://images.unsplash.com/photo-1694327876207-15246f69b411?q=80&w=3264&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'); // Изображение по умолчанию
      break;
      case '/userlist':
        setBannerText('Список пользователей');
        setBackgroundImage('https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'); // Изображение по умолчанию
      break;
      case '/profile':
      setBannerText('Ваш профиль');
      setBackgroundImage('https://images.unsplash.com/photo-1694327876207-15246f69b411?q=80&w=3264&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'); // Укажите URL изображения для страницы "Продукты"
      break;
    // Добавьте дополнительные пути по необходимости
    default:
      setBannerText('Ваш текст здесь'); 
      setBackgroundImage('https://images.unsplash.com/photo-1694327876207-15246f69b411?q=80&w=3264&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
  }
  if (categoryName === 'Продажи') {
    setBannerText('Продажи');
    setBackgroundImage('https://images.pexels.com/photos/164652/pexels-photo-164652.jpeg?auto=compress&cs=tinysrgb&w=800');
  } else if (categoryName === 'другаяКатегория') {
    setBannerText('Ваш текст для другой категории');
    setBackgroundImage('https://example.com/другая-картинка.jpg');
  }
}, [location.pathname]);


  

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
      
      {/* Передаем текст и изображение в компонент Banner */}
      {/* <Banner bannerText={bannerText} imageUrl={backgroundImage} /> */}

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