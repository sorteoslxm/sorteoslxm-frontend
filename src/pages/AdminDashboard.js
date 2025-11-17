// FILE: /Users/mustamusic/web/sorteos-lxm/src/pages/AdminDashboard.js
import React, { useState } from "react";
import axios from "axios";
import API_URL from "../config/api";

const AdminDashboard = () => {
  const [sorteo, setSorteo] = useState({
    titulo: "",
    descripcion: "",
    precio: "",
    numerosTotales: "",
    imagenUrl: "",
  });

  const handleChange = (e) => {
    setSorteo({ ...sorteo, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const logged = localStorage.getItem("adminLogged");
    if (!logged) {
      alert("No estás autenticado");
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/sorteos`, // ruta del backend: /api/sorteos
        sorteo
      );

      alert("Sorteo creado correctamente!");
      console.log("Sorteo creado:", res.data);

      setSorteo({
        titulo: "",
        descripcion: "",
        precio: "",
        numerosTotales: "",
        imagenUrl: "",
      });
    } catch (err) {
      console.error("Error al crear sorteo:", err);
      alert("Error al crear sorteo");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="text"
          name="titulo"
          placeholder="Título del sorteo"
          value={sorteo.titulo}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={sorteo.descripcion}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          type="number"
          name="precio"
          placeholder="Precio"
          value={sorteo.precio}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          type="number"
          name="numerosTotales"
          placeholder="Cantidad total de números"
          value={sorteo.numerosTotales}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="imagenUrl"
          placeholder="URL de la imagen"
          value={sorteo.imagenUrl}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Crear sorteo
        </button>
      </form>
    </div>
  );
};

export default AdminDashboard;
