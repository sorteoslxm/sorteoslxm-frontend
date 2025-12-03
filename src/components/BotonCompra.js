// FILE: /Users/mustamusic/web/sorteos-lxm/src/components/BotonCompra.js
import React, { useState } from "react";
import API_URL from "../config/api";

export default function BotonCompra({ sorteo }) {
  const [loading, setLoading] = useState(false);

  const handleCompra = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/mercadopago/crear-preferencia`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: sorteo.titulo,
          precio: sorteo.precio,
          mpCuenta: sorteo.mpCuenta, // ⚡ Importante: enviamos la cuenta
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Error backend:", data);
        alert("No se pudo crear la preferencia de pago.");
        setLoading(false);
        return;
      }

      if (data.init_point) {
        window.location.href = data.init_point;
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
      <button
        onClick={handleCompra}
        disabled={loading}
        className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-2 px-4 rounded"
      >
        {loading ? "Procesando..." : `Comprar - $${sorteo.precio}`}
      </button>
    </div>
  );
}
