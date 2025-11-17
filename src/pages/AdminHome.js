import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminHome() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminLogged");
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>
      <div className="flex flex-col gap-4 w-60">
        <Link
          to="/admin/dashboard"
          className="bg-blue-500 text-white py-2 rounded-lg text-center hover:bg-blue-600"
        >
          🧾 Gestionar Sorteos
        </Link>

        <Link
          to="/admin/banners"
          className="bg-green-500 text-white py-2 rounded-lg text-center hover:bg-green-600"
        >
          🎨 Gestionar Banners
        </Link>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
