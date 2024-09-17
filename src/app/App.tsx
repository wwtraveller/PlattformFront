import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Marketing from "../components/categories/marketing/Marketing";
import About from "../components/about/About";
import Product from "../components/categories/product/Product";
import Blog from "../components/categories/blog/Blog";
import "./App.css"; // Сохраняем подключение стилей
import SearchErrorPage from "components/search/SearchErrorPage";
import SearchResultsPage from "components/search/SearchResultsPage";
import { useState } from "react";
import Articles from "admin/componentsAdmin/articlesAdmin/Articles";
// import AdminRoute from 'admin/AdminRoute';
import Profile from "components/user/Profile";
import Dashboard from "components/user/Dashboard";
import { useAppSelector } from "redux/hooks";
import AuthWindow from "components/authWindow/AuthWindow";
import CategoryManager from "admin/componentsAdmin/categoriesAdmin/CategoryManager";
//import ArticleList from "admin/components/articles/ArticleList";
import Comments from "components/comments/Comment";

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
  const { user } = useAppSelector((state) => state.user); // Получаем данные о пользователе
  const { isOpen } = useAppSelector((state) => state.modalWindow);

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
            <Route path="/articles" element={<Articles />} />
            <Route path="/admin/categories" element={<CategoryManager />} />
            <Route path="/categories" element={<CategoryManager />} />
            {/*!!!! РАСКОМЕНТИРОВАТЬ, КОГДА БУДЕТ ГОТОВА АДМИНКА Защищённый маршрут для админов 
            <Route path="/admin/categories" element={ <AdminRoute isAdmin={isAdmin}> <CategoryManager /> </AdminRoute>}/>*/}
            <Route path="*" element={<h1>Ошибка 404</h1>} />
            
            
            {/* Проверка: если пользователь авторизован, показываем ему страницы личного кабинета */}
            {user.username && (
              <>
                <Route path="/about" element={<About />} />
                <Route path="/product" element={<Product />} />
                <Route path="/marketing" element={<Marketing />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/createarticles" element={<Articles />} />
              </>
            )}
            {/* Если пользователь не авторизован, перенаправляем на основную страницу */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
          {/* Обработка ошибок и страниц, которые не найдены */}
          <Route path="*" element={<h1>Ошибка 404: Страница не найдена</h1>} />
        </Routes>
      {isOpen && <AuthWindow />} 
      </HashRouter>
    </div>
  );
}

export default App;
