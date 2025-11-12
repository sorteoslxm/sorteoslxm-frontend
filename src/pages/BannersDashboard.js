// /Users/mustamusic/web/sorteos-lxm/client/src/pages/BannersDashboard.js
import React, { useEffect, useState } from "react";
import API_URL from "../config/api";

export default function BannersDashboard() {
  const [banners, setBanners] = useState([]);
  const [form, setForm] = useState({ titulo: "", descripcion: "", imagen: "" });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await fetch(`${API_URL}/api/banners`);
      const data = await res.json();
      setBanners(data);
    } catch (err) {
      console.error("Error cargando banners:", err);
    }
  };

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/banners`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Error guardando banner");
      fetchBanners();
      setForm({ titulo: "", descripcion: "", imagen: "" });
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Gestionar Banners</h1>

      <form onSubmit={onSubmit} className="mb-8">
        <input
          type="text"
          placeholder="Título"
          value={form.titulo}
          onChange={e => setForm({ ...form, titulo: e.target.value })}
          className="border p-2 rounded mr-2"
          required
        />
        <input
          type="text"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={e => setForm({ ...form, descripcion: e.target.value })}
          className="border p-2 rounded mr-2"
        />
        <input
          type="text"
          placeholder="URL Imagen"
          value={form.imagen}
          onChange={e => setForm({ ...form, imagen: e.target.value })}
          className="border p-2 rounded mr-2"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Crear
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {banners.map(b => (
          <div key={b.id} className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold">{b.titulo}</h2>
            <p>{b.descripcion}</p>
            {b.imagen && <img src={b.imagen} alt={b.titulo} className="mt-2" />}
          </div>
        ))}
      </div>
    </div>
  );
}
