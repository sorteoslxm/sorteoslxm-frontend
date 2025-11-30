// FILE: /Users/mustamusic/web/sorteos-lxm/src/components/AdminRoute.js

import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("admin_token");

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
