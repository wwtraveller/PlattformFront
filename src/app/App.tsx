import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
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
import Profile from 'components/user/Profile';
import Dashboard from 'components/user/Dashboard';
import { useAppSelector } from 'redux/hooks';
import AdminLayout from 'admin/AdminLayout';
import AdminDashboard from 'admin/AdminDashboard';


interface SearchItem {
  id: number;
  title: string;
  description: string;
  group: string;
}
function App() {

  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
  const { user } = useAppSelector((state) => state.user); // Получаем данные о пользователе

  // Проверка роли пользователя
  const isAdmin = user.role === 'admin'; // Убедитесь, что роль админа определяется правильно


  return (
    <div className="App">
      {/* Приветственное сообщение здесь или перенести его лучше в компонент About? */}
      {/* <h1>Hello</h1> */}
      
      {/* Логика маршрутизации */}
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
          {/* Незарегистрированный пользователь - доступные страницы */}
            <Route path="/about" element={<About />} />
            <Route path="/product" element={<Product />} />
            <Route path="/marketing" element={<Marketing />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/search-results" element={<SearchResultsPage />} />
            <Route path="/search-error" element={<SearchErrorPage />} />
            
            {/* Проверка: если пользователь авторизован, показываем ему страницы личного кабинета */}
            {user.username && !isAdmin && (
              <>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/articles" element={<Articles />} />
              </>
            )}
            {/* Если пользователь не авторизован, перенаправляем на основную страницу */}
            <Route path="*" element={<Navigate to="/" replace />} />
            </Route>

            {/* Маршруты для админа */}
            {isAdmin && (
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              {/* <Route path="/admin/articles" element={<AdminArticles />} />
              <Route path="/admin/users" element={<AdminUsers />} /> */}
              {/* Добавить другие страницы админки здесь */}
            </Route>
            )}

          {/* Обработка ошибок и страниц, которые не найдены */}
          <Route path="*" element={<h1>Ошибка 404: Страница не найдена</h1>} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;