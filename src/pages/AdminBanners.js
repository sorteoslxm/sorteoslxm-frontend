// FILE: /Users/mustamusic/web/sorteos-lxm/src/pages/AdminBanners.js
import { useEffect, useState } from "react";

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [link, setLink] = useState("");
  const [imagen, setImagen] = useState(null);
  const [cargando, setCargando] = useState(false);

  const API = process.env.REACT_APP_API_URL;

  // ============================
  // 📌 Traer banners
  // ============================
  const cargarBanners = async () => {
    try {
      const res = await fetch(`${API}/banners`);
      const data = await res.json();
      setBanners(data);
    } catch (err) {
      console.error("Error cargando banners", err);
    }
  };

  // ============================
  // 📌 Subir imagen a Cloudinary
  // ============================
  const subirACloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dx9tmn9pu/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    return data.secure_url;
  };

  // ============================
  // 📌 Agregar banner
  // ============================
  const agregarBanner = async () => {
    if (!titulo.trim()) return alert("Falta el título");
    if (!imagen) return alert("Subí una imagen");
    if (!link.trim()) return alert("Falta link");

    try {
      setCargando(true);

      // 1️⃣ Subir imagen
      const url = await subirACloudinary(imagen);

      // 2️⃣ Crear banner en backend
      const res = await fetch(`${API}/banners`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": localStorage.getItem("admin_token"),
        },
        body: JSON.stringify({
          titulo,
          link,
          imagen: url,
          principal: false,
          destacado: false,
          inferior: false,
        }),
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
      } else {
        setTitulo("");
        setLink("");
        setImagen(null);
        cargarBanners();
      }
    } catch (err) {
      console.error("Error creando banner", err);
      alert("Error creando banner");
    } finally {
      setCargando(false);
    }
  };

  // ============================
  // 📌 Eliminar banner
  // ============================
  const borrarBanner = async (id) => {
    if (!window.confirm("¿Seguro de eliminar?")) return;

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
      } else {
        cargarBanners();
      }
    } catch (err) {
      console.error("Error borrando banner", err);
    }
  };

  // ============================
  // 📌 Marcar como principal / destacado / inferior
  // ============================
  const marcar = async (id, tipo) => {
    try {
      const res = await fetch(`${API}/banners/${tipo}/${id}`, {
        method: "PUT",
        headers: {
          "x-admin-token": localStorage.getItem("admin_token"),
        },
      });

      const data = await res.json();

      if (!data.success) return alert("Error marcando banner");

      cargarBanners();
    } catch (err) {
      console.error("Error marcando banner", err);
    }
  };

  useEffect(() => {
    cargarBanners();
  }, []);

  return (
    <div className="admin-container">
      <h2>Administrar Banners</h2>

      {/* =======================
           Crear nuevo banner
         ======================= */}
      <div className="add-banner">
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <input
          type="text"
          placeholder="Link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />

        <input
          type="file"
          onChange={(e) => setImagen(e.target.files[0])}
        />

        <button disabled={cargando} onClick={agregarBanner}>
          {cargando ? "Subiendo..." : "Crear Banner"}
        </button>
      </div>

      {/* =======================
           Lista de banners
         ======================= */}
      <div className="banner-list">
        {banners.map((b) => (
          <div key={b.id} className="banner-item">
            <img src={b.imagen} alt="" />

            <p>{b.titulo}</p>

            <div className="banner-actions">
              <button onClick={() => borrarBanner(b.id)}>Eliminar</button>

              <button
                style={{ background: b.principal ? "green" : "" }}
                onClick={() => marcar(b.id, "principal")}
              >
                Principal
              </button>

              <button
                style={{ background: b.destacado ? "orange" : "" }}
                onClick={() => marcar(b.id, "destacado")}
              >
                Destacado
              </button>

              <button
                style={{ background: b.inferior ? "blue" : "" }}
                onClick={() => marcar(b.id, "inferiores")}
              >
                Inferior
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
