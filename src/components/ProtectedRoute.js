// FILE: /Users/mustamusic/web/sorteos-lxm/src/components/ProtectedRoute.js
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const isLogged = localStorage.getItem("adminLogged") === "true";
  return isLogged ? children : <Navigate to="/admin/login" />;
}
