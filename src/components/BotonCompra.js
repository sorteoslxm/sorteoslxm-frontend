// FILE: /Users/mustamusic/web/sorteos-lxm/src/components/BotonCompra.js
import React, { useState } from "react";
import API_URL from "../config/api";

export default function BotonCompra({ sorteo }) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [telefono, setTelefono] = useState("");

  const abrirModal = () => {
    setShowModal(true);
  };

  const enviarCompra = async () => {
    if (!telefono.trim()) {
      alert("Por favor ingresá tu teléfono.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/mercadopago/crear-preferencia`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: sorteo.titulo,
          precio: sorteo.precio,
          telefono: telefono,            // 🔥 ahora enviamos teléfono
          sorteoId: sorteo.id,
          mpCuenta: sorteo.mpCuenta,     // 🔥 cuenta seleccionada en admin
        }),
      });

      const data = await res.json();

      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        alert("No se pudo iniciar el pago.");
      }

    } catch (err) {
      console.error("Error:", err);
      alert("Hubo un problema al conectar con MercadoPago.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* BOTÓN PRINCIPAL */}
      <button
        onClick={abrirModal}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-500 text-white w-full py-3 rounded-xl text-xl font-bold"
      >
        {loading ? "Procesando..." : `Participar por $${sorteo.precio}`}
      </button>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-sm w-full shadow-xl">

            <h2 className="text-2xl font-bold mb-4 text-center">
              📱 Tu Whatsapp
            </h2>

            <p className="text-gray-700 mb-3 text-center">
              Pedimos tu número para poder contactarte si ganás el sorteo.
            </p>

            <input
              type="text"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Ej: 1122334455"
              className="border p-2 rounded w-full mb-4"
            />

            <button
              onClick={enviarCompra}
              className="bg-green-600 text-white w-full py-2 rounded font-bold"
            >
              Continuar al pago
            </button>

            <button
              onClick={() => setShowModal(false)}
              className="mt-3 text-center w-full text-gray-600"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
