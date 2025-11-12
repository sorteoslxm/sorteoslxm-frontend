// web/sorteos-lxm/client/src/pages/SorteoDetalle.js

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_URL from "../config/api";

export default function SorteoDetalle() {
  const { id } = useParams();
  const [sorteo, setSorteo] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/sorteos/${id}`)
      .then(res => res.json())
      .then(data => setSorteo(data))
      .catch(err => console.error("Error cargando sorteo:", err));
  }, [id]);

  if (!sorteo) return <p>Cargando...</p>;

  return (
    <div>
      <h1>{sorteo.titulo}</h1>
      <img src={sorteo.imagenUrl} alt={sorteo.titulo} />
      <p>{sorteo.descripcion}</p>
      <p>Precio: ${sorteo.precio}</p>
    </div>
  );
}
