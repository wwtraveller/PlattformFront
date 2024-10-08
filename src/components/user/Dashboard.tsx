import React from "react";
import { Route, Routes } from "react-router-dom";
import Sidebar from "./Sidebar"; // Боковое меню
import Profile from "./Profile"; // Страница профиля
// import DashboardMain from "./DashboardMain"; 
// Главная страница дашбоарда

// import Settings from "./Settings"; 
// Настройки

import styles from "./dashboard.module.css";
import FavoritesPage from "components/articles/FavoritesPage";
import Notifications from "components/notifications/Notifications";

const Dashboard: React.FC = () => {
  return (
    <div className={styles.dashboardContainer}>
      <Sidebar /> {/* Статичное боковое меню */}
      <div className={styles.content}>
        <Routes>
          {/* <Route path="/dashboard" element={<DashboardMain />} /> Главная дашбоарда */}
          <Route path="/profile" element={<Profile />} /> {/* Профиль */}
          <Route path="/notifications" element={<Notifications />} /> {/* Уведомления */}
          {/* <Route path="/settings" element={<Settings />} />  */}
          <Route path="/favorites" element={<FavoritesPage />} /> {/* Избранное */}
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
