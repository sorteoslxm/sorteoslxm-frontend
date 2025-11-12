import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("adminLogged") === "true";
  return isLoggedIn ? children : <Navigate to="/admin/login" />;
}
