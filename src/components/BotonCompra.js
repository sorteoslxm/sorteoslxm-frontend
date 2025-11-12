// /Users/mustamusic/web/sorteos-lxm/src/components/BotonCompra.js
import React, { useState } from "react";

export default function BotonCompra({ titulo, precio }) {
  const [loading, setLoading] = useState(false);

  const handleCompra = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:4000/api/crear-preferencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, precio }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Error backend:", data);
        alert("No se pudo crear la preferencia de pago.");
        setLoading(false);
        return;
      }

      // Si el backend devuelve init_point lo usamos (mejor experiencia).
      // init_point es la URL de checkout; si no, usamos redirect clásico.
      if (data.init_point) {
        window.location.href = data.init_point; // redirige al checkout web
      } else if (data.id) {
        window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?preference-id=${data.id}`;
      } else {
        alert("Respuesta inválida al crear preferencia.");
      }
    } catch (err) {
      console.error("Error al crear preferencia:", err);
      alert("Error al iniciar pago.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleCompra} disabled={loading}>
        {loading ? "Procesando..." : `Comprar - $${precio}`}
      </button>
    </div>
  );
}
