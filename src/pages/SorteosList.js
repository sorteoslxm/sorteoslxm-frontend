// FILE: src/components/SorteosList.js

import { useEffect, useState } from "react";
import API_URL from "../config/api";

export default function SorteosList() {
  const [sorteos, setSorteos] = useState([]);

  useEffect(() => {
    const fetchSorteos = async () => {
      try {
        const res = await fetch(`${API_URL}/sorteos`);
        const data = await res.json();

        console.log("🎟️ Datos sorteos cargados:", data);

        setSorteos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error cargando sorteos:", err);
      }
    };

    fetchSorteos();
  }, []);

  if (!sorteos.length) {
    return (
      <p style={{ textAlign: "center", marginTop: 20 }}>
        No hay sorteos disponibles.
      </p>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>Sorteos</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: 20,
        }}
      >
        {sorteos.map((s) => (
          <div
            key={s.id}
            style={{
              background: "#fff",
              padding: 15,
              borderRadius: 12,
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              textAlign: "center",
            }}
          >
            <img
              src={s.imagenUrl}
              style={{ width: "100%", borderRadius: 10, marginBottom: 10 }}
            />

            <h3>{s.titulo}</h3>
            <p>{s.descripcion}</p>
            <p style={{ fontWeight: "bold", marginTop: 8 }}>💰 ${s.precio}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
