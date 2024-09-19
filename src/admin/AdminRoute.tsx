import { Navigate } from "react-router-dom";
import { useAppSelector } from "redux/hooks";
interface AdminRouteProps {
  children: JSX.Element;
}
const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user } = useAppSelector((state) => state.user);
  // Проверка, есть ли у пользователя роль "ADMIN"
  const isAdmin = user?.roles.some((role) => role.authority === "ROLE_ADMIN");
  return isAdmin ? children : <Navigate to="/" replace />;
};
export default AdminRoute;