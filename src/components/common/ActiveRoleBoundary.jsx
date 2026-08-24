import { Navigate, useLocation } from "react-router-dom";

import { getStoredUser, getToken } from "../../lib/api";

function ActiveRoleBoundary({ children }) {
  const location = useLocation();
  const user = getStoredUser();
  const isLoggedIn = Boolean(getToken() && user);

  if (!isLoggedIn || location.pathname.startsWith("/auth")) {
    return children;
  }

  const roles = Array.isArray(user.roles)
    ? user.roles.map((role) => String(role).toUpperCase())
    : [];
  const canUseProviderMode = roles.includes("PROVIDER");
  const storedRole = localStorage.getItem("local_sewa_active_role")?.toUpperCase();
  const activeRole = storedRole === "PROVIDER" && canUseProviderMode
    ? "PROVIDER"
    : "CUSTOMER";
  const isProviderRoute = location.pathname.startsWith("/provider");

  if (activeRole === "PROVIDER" && !isProviderRoute) {
    return <Navigate to="/provider/dashboard" replace />;
  }

  if (activeRole === "CUSTOMER" && isProviderRoute) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ActiveRoleBoundary;
