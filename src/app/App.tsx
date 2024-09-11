import { HashRouter, Route, Routes } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Marketing from '../components/categories/marketing/Marketing';
import About from '../components/about/About';
import Product from '../components/categories/product/Product';
import Blog from '../components/categories/blog/Blog';
import './App.css'; // Сохраняем подключение стилей
import SearchErrorPage from 'components/search/SearchErrorPage';
import SearchResultsPage from 'components/search/SearchResultsPage';
import { useState } from 'react';
import Articles from 'components/articles/Articles';
import AdminRoute from 'admin/AdminRoute';
import CategoryManager from 'components/categories/CategoryManager';
import CategoryManagementPage from 'components/categories/CategoryManagementPage';


interface SearchItem {
  id: number;
  title: string;
  description: string;
  group: string;
}
function App() {
  //! const isAdmin = true; //проверка, является ли пользователь админом. РАСКОМЕНТИРОВАТЬ КОГДА БУДЕТ ГОТОВА АДМИНКА

  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
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
            <Route path="/articles" element={<Articles />} />
            <Route path="/admin/categories" element={<CategoryManagementPage />} />
            {/*!!!! РАСКОМЕНТИРОВАТЬ, КОГДА БУДЕТ ГОТОВА АДМИНКА Защищённый маршрут для админов 
        <Route path="/admin/categories" element={ <AdminRoute isAdmin={isAdmin}> <CategoryManager /> </AdminRoute>}/>*/}
            <Route path="*" element={<h1>Ошибка 404</h1>} />
          </Route>
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;