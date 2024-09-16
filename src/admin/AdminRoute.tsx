import React from 'react';
import { Navigate } from 'react-router-dom';

interface AdminRouteProps {
  children: React.ReactNode;
  isAdmin: boolean; 
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children, isAdmin }) => {
  if (!isAdmin) {

    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default AdminRoute;
