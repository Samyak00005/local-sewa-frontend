import { Navigate, useLocation } from "react-router-dom";

import { getStoredUser, getToken } from "../../lib/api";
import LoginRequiredPage from "./LoginRequiredPage";

function ProtectedRoute({ role, children }) {
  const location = useLocation();
  const token = getToken();
  const user = getStoredUser();
  const roles = Array.isArray(user?.roles) ? user.roles : [];

  if (!token || !user) {
    if (role !== "PROVIDER") return <LoginRequiredPage />;
    return <Navigate to="/auth/provider/login" replace state={{ from: location.pathname }} />;
  }

  if (role && !roles.includes(role)) {
    return <Navigate to={role === "PROVIDER" ? "/auth/provider/register" : "/auth"} replace />;
  }

  return children;
}

export default ProtectedRoute;
