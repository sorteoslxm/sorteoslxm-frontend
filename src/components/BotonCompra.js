// FILE: /Users/mustamusic/web/sorteos-lxm/src/components/BotonCompra.js
import React, { useState } from "react";
import API_URL from "../config/api";

export default function BotonCompra({ sorteo }) {
  const [loading, setLoading] = useState(false);

  const promptTelefono = () => {
    // Podés reemplazar este prompt por un modal más lindo si querés.
    const t = window.prompt("Dejanos tu WhatsApp (ej. 54911xxxxxxx) para contactarte si ganás:");
    return t ? t.trim() : "";
  };

  const handleCompra = async () => {
    try {
      if (!sorteo.activo) return alert("Sorteo no está disponible.");

      // Si admin configuró mostrar contador y se usa, dejamos comprar
      const telefono = promptTelefono();
      if (!telefono) return alert("Necesitamos un teléfono para completar la compra.");

      setLoading(true);

      const res = await fetch(`${API_URL}/mercadopago/crear-preferencia`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: sorteo.titulo,
          precio: sorteo.precio,
          mpCuenta: sorteo.mpCuenta,
          sorteoId: sorteo.id,
          telefono,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "No se pudo crear la preferencia.");
        setLoading(false);
        return;
      }

      if (data.init_point) {
        window.location.href = data.init_point;
      } else if (data.id) {
        window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?preference-id=${data.id}`;
      } else {
        alert("Respuesta inválida del servidor.");
      }
    } catch (err) {
      console.error("Error al crear preferencia:", err);
      alert("Error al iniciar pago.");
    } finally {
      setLoading(false);
    }
  };

  if (!sorteo.activo) return <p className="text-red-500">Sorteo no disponible</p>;

  return (
    <button
      onClick={handleCompra}
      disabled={loading}
      className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-2 px-4 rounded"
    >
      {loading ? "Procesando..." : `Comprar - $${sorteo.precio}`}
    </button>
  );
}
