// FILE: /Users/mustamusic/web/sorteos-lxm/src/pages/AdminBanners.js

import { useEffect, useState } from "react";

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [nuevoBanner, setNuevoBanner] = useState("");

  const API = process.env.REACT_APP_API_URL;

  // 🟦 Traer banners
  const cargarBanners = async () => {
    try {
      const res = await fetch(`${API}/banners`);
      const data = await res.json();
      setBanners(data);
    } catch (err) {
      console.error("Error cargando banners", err);
    }
  };

  // 🟩 Agregar banner
  const agregarBanner = async () => {
    if (!nuevoBanner.trim()) return alert("Ingresá una URL");

    try {
      const res = await fetch(`${API}/banners`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": localStorage.getItem("admin_token"),
        },
        body: JSON.stringify({ imagen: nuevoBanner }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.error || "Error");
        return;
      }

      setNuevoBanner("");
      cargarBanners();
    } catch (err) {
      console.error("Error agregando banner", err);
    }
  };

  // 🟥 Borrar banner
  const borrarBanner = async (id) => {
    if (!window.confirm("¿Eliminar banner?")) return;

    try {
      const res = await fetch(`${API}/banners/${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-token": localStorage.getItem("admin_token"),
        },
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.error || "Error");
        return;
      }

      cargarBanners();
    } catch (err) {
      console.error("Error borrando banner", err);
    }
  };

  useEffect(() => {
    cargarBanners();
  }, []);

  return (
    <div className="admin-container">
      <h2>Banners</h2>

      <div className="add-banner">
        <input
          type="text"
          placeholder="URL de imagen"
          value={nuevoBanner}
          onChange={(e) => setNuevoBanner(e.target.value)}
        />
        <button onClick={agregarBanner}>Agregar</button>
      </div>

      <div className="banner-list">
        {banners.map((b) => (
          <div key={b.id} className="banner-item">
            <img src={b.imagen} alt="" />
            <button onClick={() => borrarBanner(b.id)}>Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
}
