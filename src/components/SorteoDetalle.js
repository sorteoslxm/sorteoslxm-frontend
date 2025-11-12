// /Users/mustamusic/web/sorteos-lxm/src/components/SorteoDetalle.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BotonCompra from "./BotonCompra";

export default function SorteoDetalle() {
  const { id } = useParams();
  const [sorteo, setSorteo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSorteo = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/sorteos`);
        const data = await res.json();

        // buscamos el sorteo por id
        const found = data.find((s) => s.id === id);
        setSorteo(found || null);
      } catch (err) {
        console.error("Error cargando sorteo:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSorteo();
  }, [id]);

  if (loading) return <div>Cargando sorteo...</div>;
  if (!sorteo) return <div>No se encontró el sorteo.</div>;

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>{sorteo.titulo || sorteo.nombre}</h2>
      {sorteo.imagenUrl || sorteo.imagen ? (
        <img
          src={sorteo.imagenUrl || sorteo.imagen}
          alt={sorteo.titulo || sorteo.nombre}
          style={{ maxWidth: 400, borderRadius: "10px" }}
        />
      ) : null}
      <p style={{ marginTop: 20 }}>{sorteo.descripcion}</p>
      <p>
        <strong>Precio:</strong> ${sorteo.precio}
      </p>

      <BotonCompra titulo={sorteo.titulo || sorteo.nombre} precio={sorteo.precio} />
    </div>
  );
}
