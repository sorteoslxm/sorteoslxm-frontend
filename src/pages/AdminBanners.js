import React, { useEffect, useState } from "react";
import API_URL from "../config/api";

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [nuevoBanner, setNuevoBanner] = useState({ titulo: "", imagenUrl: "" });

  const fetchBanners = () => {
    console.log("Cargando banners desde:", `${API_URL}/banners`);
    fetch(`${API_URL}/banners`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Banners recibidos:", data);
        setBanners(data);
      })
      .catch((err) => console.error("Error al cargar banners:", err));
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleChange = (e) => {
    setNuevoBanner({ ...nuevoBanner, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Creando banner:", nuevoBanner);

    try {
      const res = await fetch(`${API_URL}/banners`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoBanner),
      });

      if (!res.ok) throw new Error("Error al crear banner");

      setNuevoBanner({ titulo: "", imagenUrl: "" });
      fetchBanners();
    } catch (error) {
      console.error("Error al crear banner:", error);
      alert("Hubo un problema al crear el banner.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que querés eliminar este banner?")) return;
    await fetch(`${API_URL}/banners/${id}`, { method: "DELETE" });
    fetchBanners();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-bold mb-6">🎨 Gestión de Banners</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md mb-8 flex flex-col gap-3 max-w-lg"
      >
        <input
          name="titulo"
          value={nuevoBanner.titulo}
          onChange={handleChange}
          placeholder="Título del banner"
          className="border p-2 rounded"
          required
        />
        <input
          name="imagenUrl"
          value={nuevoBanner.imagenUrl}
          onChange={handleChange}
          placeholder="URL de la imagen (Cloudinary)"
          className="border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Agregar Banner
        </button>
      </form>

      <div>
        <h3 className="text-xl font-semibold mb-4">Banners actuales</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {banners.map((b) => (
            <li
              key={b.id}
              className="bg-white shadow p-4 rounded flex flex-col items-center"
            >
              <img
                src={b.imagenUrl}
                alt={b.titulo}
                className="w-60 h-32 object-cover rounded mb-2"
              />
              <p className="font-bold">{b.titulo}</p>
              <button
                onClick={() => handleDelete(b.id)}
                className="bg-red-500 text-white px-3 py-1 rounded mt-2 hover:bg-red-600"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
