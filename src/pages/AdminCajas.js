// FILE: src/pages/AdminCajas.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

export default function AdminCajas() {
  const [cajas, setCajas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    nombre: "",
    totalCajas: "",
    premios: [
      { nombre: "Premio Mayor", monto: "", cantidadTotal: "", desbloqueoPorVentas: "", visible: true, esMayor: true },
      { nombre: "Premios $20.000", monto: "", cantidadTotal: "", desbloqueoPorVentas: "", visible: true, esMayor: false },
      { nombre: "Premios $10.000", monto: "", cantidadTotal: "", desbloqueoPorVentas: "", visible: true, esMayor: false },
      { nombre: "Créditos", monto: "", cantidadTotal: "", desbloqueoPorVentas: "", visible: true, esMayor: false },
    ],
  });

  const navigate = useNavigate();

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

  useEffect(() => { loadCajas(); }, []);

  const handlePremioChange = (index, field, value) => {
    setForm((prev) => {
      const premios = [...prev.premios];
      premios[index] = { ...premios[index], [field]: value };
      return { ...prev, premios };
    });
  };

  const handleCrearCaja = async () => {
    if (!form.nombre || !form.totalCajas) return alert("Nombre y stock son obligatorios");

    try {
      const res = await fetch(`${API_URL}/admin/cajas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, totalCajas: Number(form.totalCajas) }),
      });
      if (!res.ok) throw new Error("Error creando caja");
      setForm({ ...form, nombre: "", totalCajas: "" }); // reset
      loadCajas();
    } catch (err) { console.error(err); alert(err.message); }
  };

  const handleCerrarCaja = async (id) => {
    if (!confirm("Cerrar caja? No se podrá volver a activar")) return;
    try {
      await fetch(`${API_URL}/admin/cajas/${id}/cerrar`, { method: "PUT" });
      loadCajas();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="p-8 text-white max-w-6xl mx-auto space-y-10">
      <h1 className="text-3xl font-extrabold">Cajas</h1>

      {/* LISTA CAJAS */}
      <div className="space-y-4">
        {loading ? <p>Cargando cajas…</p> : cajas.map(c => (
          <div key={c.id} className="bg-zinc-800 p-4 rounded-xl flex justify-between items-center border border-zinc-700">
            <div>
              <p className="font-bold text-white">{c.nombre}</p>
              <p className="text-sm text-gray-400">Stock: {c.totalCajas} — Estado: {c.estado}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => navigate(`/admin/cajas/editar/${c.id}`)} className="px-3 py-1 rounded bg-yellow-500 text-black">Editar</button>
              {c.estado !== "cerrada" && (
                <button onClick={() => handleCerrarCaja(c.id)} className="px-3 py-1 rounded bg-red-600 text-white">Cerrar</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CREAR CAJA */}
      <div className="mt-10 bg-zinc-900 p-6 rounded-xl border border-zinc-700 space-y-4">
        <h2 className="text-xl font-bold text-yellow-400">➕ Crear nueva caja</h2>
        <input className="w-full p-3 rounded bg-black/40 border border-white/10" placeholder="Nombre" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
        <input type="number" className="w-full p-3 rounded bg-black/40 border border-white/10" placeholder="Total de cajas" value={form.totalCajas} onChange={e => setForm({ ...form, totalCajas: e.target.value })} />
        <button onClick={handleCrearCaja} className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-2 rounded-xl font-bold">Crear caja</button>
      </div>
    </div>
  );
}
