// FILE: src/pages/AdminDashboard.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../config/api";

export default function AdminDashboard() {
  const [sorteos, setSorteos] = useState([]);
  const navigate = useNavigate();

  // Verificar token
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const fetchSorteos = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await fetch(`${API_URL}/sorteos`, {
        headers: {
          "x-admin-token": token,
        },
      });

      const data = await res.json();
      setSorteos(data);
    } catch (error) {
      console.error("Error cargando sorteos:", error);
    }
  };

  useEffect(() => {
    fetchSorteos();
  }, []);

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Cerrar sesión
        </button>
      </div>

      {/* BOTONERA ADMIN */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Link
          to="/admin/sorteos/nuevo"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          ➕ Nuevo sorteo
        </Link>

        <Link
          to="/admin/banners"
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          🎨 Gestionar banners
        </Link>

        <Link
          to="/admin/compras"
          className="bg-gray-600 text-white px-4 py-2 rounded"
        >
          🧾 Ver Compras
        </Link>

        <Link
          to="/admin/chances"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          🎟️ Control de Chances
        </Link>

        {/* 🔥 NUEVO */}
        <Link
          to="/admin/dashboard/ventas"
          className="bg-black text-white px-4 py-2 rounded"
        >
          📊 Dashboard de Ventas
        </Link>
      </div>

      {/* LISTADO DE SORTEOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {sorteos.map((s) => (
          <div key={s.id} className="bg-white shadow rounded p-3">
            <img
              src={s.imagenUrl}
              className="w-full h-40 object-cover rounded"
              alt="imagen sorteo"
            />

            <h2 className="text-xl font-bold mt-2">{s.titulo}</h2>
            <p className="text-gray-700 text-sm">{s.descripcion}</p>

            <Link
              to={`/admin/sorteos/editar/${s.id}`}
              className="bg-yellow-500 text-white px-3 py-1 rounded inline-block mt-3"
            >
              ✏️ Editar
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
