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

  if (!sorteo) return <p className="p-4 text-center">Cargando...</p>;

  const continuarAlPago = async () => {
    if (!telefono) return alert("Ingresá tu WhatsApp");

    try {
      setLoadingCompra(true);

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
      console.log("➡️ MP RESPONSE:", data);

      if (!res.ok) return alert(data.error || "Error creando pago");

      window.location.href = data.init_point;
    } catch {
      alert("Error conectando con MercadoPago");
    } finally {
      setLoadingCompra(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <img src={sorteo.imagenUrl} alt={sorteo.titulo} className="rounded-xl" />

      <h1 className="text-3xl font-bold mt-3">{sorteo.titulo}</h1>
      <p className="text-2xl text-green-600 font-bold my-4">
        ${sorteo.precio}
      </p>

      <button
        className="w-full bg-blue-600 text-white py-3 rounded-xl"
        onClick={() => setMostrarModal(true)}
      >
        Participar
      </button>

      {mostrarModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="font-bold mb-2 text-xl">Tu WhatsApp</h2>
            <input
              className="border p-3 w-full mb-4 rounded"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />

            <button
              className="w-full bg-green-600 text-white py-3 rounded-xl mb-2"
              onClick={continuarAlPago}
              disabled={loadingCompra}
            >
              {loadingCompra ? "Procesando..." : "Pagar"}
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
