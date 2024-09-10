import { HashRouter, Route, Routes } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Marketing from '../components/marketing/Marketing';
import About from '../components/about/About';
import Product from '../components/product/Product';
import Blog from '../components/blog/Blog';
import './App.css'; // Сохраняем подключение стилей
import SearchErrorPage from 'components/search/SearchErrorPage';
import SearchResultsPage from 'components/search/SearchResultsPage';

function App() {
  return (
    <div className="App">
      {/* Приветственное сообщение здесь или перенести его лучше в компонент About? */}
      {/* <h1>Hello</h1> */}
      
      {/* Логика маршрутизации */}
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/about" element={<About />} />
            <Route path="/product" element={<Product />} />
            <Route path="/marketing" element={<Marketing />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/search-results" element={<SearchResultsPage />} />
            <Route path="/search-error" element={<SearchErrorPage />} />
            <Route path="*" element={<h1>Ошибка 404</h1>} />
          </Route>
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;