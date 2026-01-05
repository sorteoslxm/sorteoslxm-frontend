// FILE: src/pages/AdminCajasList.js
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../config/api";

export default function AdminCajasList({ reload }) {
  const [cajas, setCajas] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCajas = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/cajas`);
      const data = await res.json();
      setCajas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCajas();
  }, [reload]);

  if (loading) return <p className="text-gray-400">Cargando…</p>;
  if (cajas.length === 0) return <p className="text-gray-400">No hay cajas</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">📦 Cajas creadas</h2>

      {cajas.map((caja) => (
        <div
          key={caja.id}
          className="flex justify-between items-center bg-zinc-800 p-4 rounded border border-zinc-700"
        >
          <div>
            <p className="font-bold text-white">{caja.nombre}</p>
            <p className="text-xs text-gray-400">Stock: {caja.totalCajas}</p>
          </div>

          <Link
            to={`/admin/cajas/editar/${caja.id}`}
            className="bg-black border px-4 py-2 rounded text-sm"
          >
            Editar / Packs
          </Link>
        </div>
      ))}
    </div>
  );
}
