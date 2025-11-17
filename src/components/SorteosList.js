import React, { useEffect, useState } from "react";
import API_URL from "../config/api";

export default function SorteosList() {
  const [sorteos, setSorteos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSorteos = async () => {
      try {
        const res = await fetch(`${API_URL}/sorteos`);
        const data = await res.json();
        setSorteos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error cargando sorteos:", err);
        setSorteos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSorteos();
  }, []);

  if (loading) return <p style={{ textAlign: "center", marginTop: 20 }}>Cargando...</p>;
  if (!sorteos.length) return <p style={{ textAlign: "center", marginTop: 20 }}>No hay sorteos disponibles.</p>;

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))" }}>
        {sorteos.map((s) => (
          <div key={s.id} style={{ background: "#fff", padding: 14, borderRadius: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <img src={s.imagen || s.imagenUrl || ""} alt={s.nombre || s.titulo} style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 8 }} />
            <h3 style={{ marginTop: 10 }}>{s.nombre || s.titulo}</h3>
            <p>{s.descripcion || "Sin descripción"}</p>
            <p style={{ fontWeight: 700 }}>💰 ${s.precio}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
