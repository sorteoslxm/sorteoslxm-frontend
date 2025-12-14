// FILE: src/pages/SorteoDetalle.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_URL from "../config/api";

export default function SorteoDetalle() {
  const { id } = useParams();
  const [sorteo, setSorteo] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [telefono, setTelefono] = useState("");
  const [loadingCompra, setLoadingCompra] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/sorteos/${id}`)
      .then((res) => res.json())
      .then(setSorteo)
      .catch((err) => console.error("ERROR sorteo:", err));
  }, [id]);

  if (!sorteo) {
    return <p className="p-4 text-center">Cargando...</p>;
  }

  const sorteoCerrado =
    sorteo.cerrado === true || sorteo.chancesDisponibles <= 0;

  const continuarAlPago = async () => {
    if (sorteoCerrado || loadingCompra) return;

    if (!telefono) {
      return alert("Ingresá tu WhatsApp");
    }

    if (!/^\d{10,13}$/.test(telefono)) {
      return alert("Ingresá un WhatsApp válido (solo números)");
    }

    try {
      setLoadingCompra(true);
      setMostrarModal(false);

      const res = await fetch(`${API_URL}/mercadopago/crear-preferencia`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sorteoId: sorteo.id,
          titulo: sorteo.titulo,
          precio: sorteo.precio,
          cantidad: 1,
          telefono,
          mpCuenta: sorteo.mpCuenta || "default",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.init_point) {
        console.error("Error MP:", data);
        alert("❌ No se pudo iniciar el pago. Intentá nuevamente.");
        setLoadingCompra(false);
        return;
      }

      // 🔁 Redirección a MercadoPago
      window.location.href = data.init_point;
    } catch (err) {
      console.error(err);
      alert("❌ Error conectando con MercadoPago");
      setLoadingCompra(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <img
        src={sorteo.imagenUrl}
        alt={sorteo.titulo}
        className="rounded-xl w-full"
      />

      <h1 className="text-3xl font-bold mt-3">{sorteo.titulo}</h1>

      {sorteo.descripcion && (
        <p className="text-gray-700 mt-2 whitespace-pre-line">
          {sorteo.descripcion}
        </p>
      )}

      <p className="text-2xl text-green-600 font-bold my-4">
        ${sorteo.precio}
      </p>

      {/* 🔥 ÚLTIMAS CHANCES */}
      {sorteo.chancesDisponibles > 0 &&
        sorteo.chancesDisponibles <= 10 && (
          <div className="bg-red-600 text-white text-center py-2 rounded-xl font-bold animate-pulse mb-4">
            🔥 Últimas {sorteo.chancesDisponibles} chances disponibles
          </div>
        )}

      {/* 🚫 SORTEO CERRADO */}
      {sorteoCerrado && (
        <div className="bg-gray-300 text-gray-800 text-center py-3 rounded-xl font-bold mb-4">
          ⛔ Sorteo cerrado — no hay más chances disponibles
        </div>
      )}

      <button
        className={`w-full py-3 rounded-xl text-white ${
          sorteoCerrado || loadingCompra
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600"
        }`}
        onClick={() => setMostrarModal(true)}
        disabled={sorteoCerrado || loadingCompra}
      >
        {loadingCompra
          ? "Redirigiendo a MercadoPago..."
          : sorteoCerrado
          ? "Sorteo cerrado"
          : "Participar"}
      </button>

      {mostrarModal && !sorteoCerrado && !loadingCompra && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="font-bold mb-2 text-xl">Tu WhatsApp</h2>

            <p className="text-gray-600 mb-3">
              Necesitamos tu WhatsApp para poder contactarte si resultás ganador 🎉
            </p>

            <input
              className="border p-3 w-full mb-4 rounded"
              placeholder="Ejemplo: 1122334455"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />

            <button
              className="w-full bg-green-600 text-white py-3 rounded-xl mb-2"
              onClick={continuarAlPago}
            >
              Ir a pagar
            </button>

            <button
              onClick={() => setMostrarModal(false)}
              className="underline text-gray-600"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
