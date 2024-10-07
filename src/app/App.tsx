import {
  HashRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Layout from "../components/layout/Layout";
import About from "../components/about/About";
import Product from "../components/categories/product/Product";
import "./App.css"; // Сохраняем подключение стилей
import SearchErrorPage from "components/search/SearchErrorPage";
import SearchResultsPage from "components/search/SearchResultsPage";
import { useEffect, useState } from "react";
import Profile from "components/user/Profile";
import Dashboard from "components/user/Dashboard";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import AuthWindow from "components/authWindow/AuthWindow";
import CategoryManager from "admin/componentsAdmin/categoriesAdmin/CategoryManager";
//import ArticleList from "admin/components/articles/ArticleList";
import Comments from "components/comments/Comment";
import { hideModal } from "features/auth/modalWindowSlice";
import { getUserWithToken } from "features/auth/authAction";
import ArticleUser from "components/articles/ArticleUser";
import CategoryLinks from "components/categories/CategoryLink";
import ArticlePage from "components/articles/ArticlePageUser";
import AdminRoute from "admin/AdminRoute";
import Login from "components/login/Login";
import ArticlePageUser from "components/articles/ArticlePageUser";
import UserMenu from "components/user/UserMenu";
import FavoritesPage from "components/articles/FavoritesPage";
import ArticlesListPage from "admin/componentsAdmin/articlesAdmin/ArticlesListPage";
import Articles from "admin/componentsAdmin/articlesAdmin/Articles";
import { ToastContainer } from "react-toastify";
import UserList from "admin/componentsAdmin/UserListAdmin/UserLIst";
import Partner from "components/partner/Partner";
import Contact from "components/contact/Contact";
import Authors from "components/authors/Authors";
import FaqPage from "components/faq/FaqPage";
import Glossary from "components/glossary/GlossaryPage";
import Homepage from "components/home/Homepage";

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
  const { user } = useAppSelector((state) => state.auth);
  const { isOpen } = useAppSelector((state) => state.modalWindow);
  const dispatch = useAppDispatch();
  const handleLoginSuccess = (): void => {
    dispatch(hideModal());
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      dispatch(getUserWithToken(accessToken))
        .unwrap()
        .then(() => {
          console.log("User data loaded:", user);
        })
        .catch((error) => {
          console.error("Error loading user data:", error);
          localStorage.removeItem("accessToken");
        });
    }
  }, [dispatch]);

  return (
    <div className="App">
      {/* Приветственное сообщение здесь или перенести его лучше в компонент About? */}
      {/* <h1>Hello</h1> */}

      {/* Логика маршрутизации */}
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Незарегистрированный пользователь - доступные страницы */}
            <Route path="/" element={<Homepage />} />
            <Route path="/catLinks" element={<CategoryLinks />} />
            <Route path="/category/:category" element={<ArticleUser />} />
            <Route path="/articles" element={<ArticleUser />} />
            <Route path="/articles/:id" element={<ArticlePageUser />} />
            <Route path="/about" element={<About />} />
            <Route path="/authors" element={<Authors />} />
            <Route path="/partner" element={<Partner />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/glossary" element={<Glossary />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/search-results" element={<SearchResultsPage />} />
            <Route path="/search-error" element={<SearchErrorPage />} />
            <Route path="/article/:id" element={<ArticlePage />} />

            {/* Проверка: если пользователь авторизован, показываем ему страницы личного кабинета */}
            {user?.username && (
              <>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                {/* <Route path="/catLinks" element={<CategoryLinks />} />
                <Route path="/category/:category" element={<ArticleUser />} />
              <Route path="/article/:id" element={<ArticlePage />} /> */}
                {/* <Route path="/favorites" element={<ArticlePage />} /> */}
                <Route path="/favorites" element={<FavoritesPage />} />
              </>
            )}
            {/* Если пользователь не авторизован, перенаправляем на основную страницу */}
            {/* <Route path="*" element={<Navigate to="/" replace />} /> */}

            {/* Защищенные маршруты для админа */}
            {user?.roles?.some((role) => role.authority === "ROLE_ADMIN") && (
              <>
                <Route
                  path="/admin/createArticles"
                  element={
                    <AdminRoute>
                      <Articles />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/createCategories"
                  element={
                    <AdminRoute>
                      <CategoryManager />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/articlesList"
                  element={
                    <AdminRoute>
                      <ArticlesListPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/userList"
                  element={
                    <AdminRoute>
                      <UserList />
                    </AdminRoute>
                  }
                />
              </>
            )}
            {/*!!!! РАСКОМЕНТИРОВАТЬ, КОГДА БУДЕТ ГОТОВА АДМИНКА Защищённый маршрут для админов 
            <Route path="/admin/categories" element={ <AdminRoute isAdmin={isAdmin}> <CategoryManager /> </AdminRoute>}/>*/}
          </Route>

          {/* Обработка ошибок и страниц, которые не найдены */}
          <Route path="*" element={<h1>Ошибка 404: Страница не найдена</h1>} />
        </Routes>

        {isOpen && <AuthWindow onLoginSuccess={handleLoginSuccess} />}
        <ToastContainer 
        position="top-right" // Позиция уведомлений
        autoClose={3000} // Время автоматического закрытия
        hideProgressBar={false} // Показать полоску прогресса
        newestOnTop={false} // Новые уведомления выше старых
        closeOnClick // Закрывать по клику
        rtl={false} // Если используется RTL
        pauseOnFocusLoss // Приостановка при потере фокуса
        draggable // Возможность перетаскивания
        pauseOnHover // Приостановка при наведении
      />
            </HashRouter>
    </div>
  );
}

export default App;
