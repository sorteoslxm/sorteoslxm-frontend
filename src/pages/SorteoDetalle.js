// FILE: web/sorteos-lxm/src/pages/SorteoDetalle.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_URL from "../config/api";

export default function SorteoDetalle() {
  const { id } = useParams();
  const [sorteo, setSorteo] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [telefono, setTelefono] = useState("");
  const [loadingCompra, setLoadingCompra] = useState(false);

  // Obtener sorteo
  useEffect(() => {
    fetch(`${API_URL}/sorteos/${id}`)
      .then((res) => res.json())
      .then((data) => setSorteo(data))
      .catch((err) => console.error("ERROR sorteo:", err));
  }, [id]);

  if (!sorteo) {
    return <p className="p-4 text-center">Cargando...</p>;
  }

  const abrirModal = () => setMostrarModal(true);
  const cerrarModal = () => setMostrarModal(false);

  const continuarAlPago = async () => {
    if (!telefono.trim()) return alert("Ingresá tu WhatsApp!");
    if (telefono.length < 6) return alert("El número es muy corto!");

    try {
      setLoadingCompra(true);

      const body = {
        sorteoId: sorteo.id,
        titulo: sorteo.titulo,
        precio: sorteo.precio,
        telefono,
        cantidad: 1,
        mpCuenta: sorteo.mpCuenta || "default",
      };

      // ❗ CORREGIDO: ruta correcta del backend
      const res = await fetch(`${API_URL}/mercadopago/crear-preferencia`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "No se pudo iniciar el pago");
        setLoadingCompra(false);
        return;
      }

      // Redirección a MercadoPago
      if (data.init_point) {
        window.location.href = data.init_point;
      } else if (data.preferenceId) {
        window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?preference-id=${data.preferenceId}`;
      } else {
        alert("Respuesta inválida del servidor (sin init_point)");
      }
    } catch (err) {
      console.error("Error al crear preferencia:", err);
      alert("Error al crear preferencia");
    } finally {
      setLoadingCompra(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* IMAGEN */}
      <div className="w-full bg-black rounded-xl mb-4 flex items-center justify-center">
        <img
          src={sorteo.imagenUrl}
          alt={sorteo.titulo}
          className="w-full max-h-[420px] object-contain rounded-xl"
        />
      </div>

      {/* TITULO */}
      <h1 className="text-3xl font-bold mb-2">{sorteo.titulo}</h1>

      {/* ULTIMAS CHANCES */}
      {sorteo.mostrarCuentaRegresiva && (
        <div className="mb-3">
          <div className="inline-block bg-red-600 text-white font-bold px-4 py-2 rounded">
            ⏳ {sorteo.textoCuentaRegresiva || "Últimas chances!"}
          </div>
        </div>
      )}

      {/* PRECIO */}
      <p className="text-2xl font-bold text-green-600 mb-4">
        💰 Precio por chance: ${sorteo.precio}
      </p>

      {/* DESCRIPCION */}
      <p className="text-lg mb-4 whitespace-pre-line text-gray-800">
        {sorteo.descripcion}
      </p>

      {/* BOTÓN FIJO */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-white shadow-2xl">
        <button
          className="w-full bg-blue-600 text-white py-3 rounded-xl text-xl font-bold"
          onClick={abrirModal}
        >
          Participar
        </button>
      </div>

      {/* MODAL */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl text-center">
            <h2 className="text-2xl font-bold mb-2">📱 Antes de continuar…</h2>
            <p className="text-gray-700 mb-4">
              Pedimos tu WhatsApp para poder contactarte si ganás el sorteo.
            </p>

            <input
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Ej: 11 6543-2190"
              className="border p-3 rounded w-full mb-4 text-lg"
            />

            <button
              onClick={continuarAlPago}
              disabled={loadingCompra}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold mb-2"
            >
              {loadingCompra ? "Procesando..." : "Continuar al pago"}
            </button>

            <button onClick={cerrarModal} className="text-gray-700 underline">
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
