import ReactDOM from 'react-dom/client';
import './index.css';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Marketing from './components/marketing/Marketing';
import About from './components/about/About';
import Product from './components/product/Product';
import Blog from './components/blog/Blog';


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  // обертка router над всеми элементами
  <HashRouter>
    {/* обертка для описания маршрутов */}
    <Routes>
      {/* маршрут-родитель, в котором мы отображаем остальные компоненты */}
      <Route path='/' element={<Layout />} >
        <Route path='/about' element={<About />} />
        <Route path='/product' element={<Product />} />
        <Route path='/marketing' element={<Marketing />} />
        <Route path='/blog' element={<Blog />} />
        <Route path='*' element={<h1>Error 404 😵</h1>} />
      </Route>
    </Routes>
  </HashRouter>
);
