// FILE: src/components/BotonComprarCaja.js
import { useState } from "react";
import API_URL from "../config/api";

export default function BotonComprarCaja({ cajaId, pack }) {
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

      const res = await fetch(`${API_URL}/cajas/pago`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cajaId,
          packId: pack.id,
          precio: pack.precio,
          telefono,
        }),
      });

      const data = await res.json();

      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        alert("No se pudo iniciar el pago.");
      }
    } catch (err) {
      console.error("❌ Error MercadoPago:", err);
      alert("Hubo un problema al conectar con MercadoPago.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* BOTÓN */}
      <button
        onClick={abrirModal}
        disabled={loading}
        className="w-full py-3 rounded-xl font-extrabold text-lg
          bg-gradient-to-r from-yellow-400 to-orange-500
          text-black shadow-xl
          hover:scale-[1.03] active:scale-95 transition"
      >
        {loading
          ? "Procesando..."
          : `Comprar por $${pack.precio}`}
      </button>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-sm w-full shadow-2xl">

            <h2 className="text-2xl font-extrabold mb-3 text-center">
              📱 Tu WhatsApp
            </h2>

            <p className="text-gray-700 mb-4 text-center">
              Te contactamos si ganás un premio.
            </p>

            <input
              type="text"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Ej: 1122334455"
              className="border p-3 rounded w-full mb-4 text-center"
            />

            <button
              onClick={enviarCompra}
              className="bg-green-600 hover:bg-green-500 text-white w-full py-3 rounded-xl font-bold"
            >
              Ir a MercadoPago
            </button>

            <button
              onClick={() => setShowModal(false)}
              className="mt-3 w-full text-gray-500"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
