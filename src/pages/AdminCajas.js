// FILE: web/sorteos-lxm/src/pages/AdminCajas.js
import { useState, useEffect } from "react";
import API_URL from "../config/api";
import AdminPacks from "../components/AdminPacks";

export default function AdminCajas() {
  const [form, setForm] = useState({
    nombre: "",
    totalCajas: "",
    precioCaja: "",
    estado: "activa",
    premios: [
      { nombre: "Premio Mayor", monto: "", cantidadTotal: "", desbloqueoPorVentas: "", visible: true, esMayor: true },
      { nombre: "Premio $20.000", monto: "", cantidadTotal: "", desbloqueoPorVentas: "", visible: true },
      { nombre: "Premio $10.000", monto: "", cantidadTotal: "", desbloqueoPorVentas: "", visible: true },
      { nombre: "Créditos", monto: "", cantidadTotal: "", desbloqueoPorVentas: "", visible: true },
    ],
  });

  const [saving, setSaving] = useState(false);
  const [cajas, setCajas] = useState([]);
  const [selectedCaja, setSelectedCaja] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/admin/cajas`)
      .then(res => res.json())
      .then(data => setCajas(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error cargando cajas", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePremioChange = (index, field, value) => {
    setForm(prev => {
      const premios = [...prev.premios];
      premios[index][field] = value;
      return { ...prev, premios };
    });
  };

  const handleCrearCaja = async () => {
    if (!form.nombre || !form.totalCajas) {
      return alert("Completa nombre y stock");
    }

    setSaving(true);

    try {
      const res = await fetch(`${API_URL}/admin/cajas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          totalCajas: Number(form.totalCajas),
          precioCaja: Number(form.precioCaja || 0),
          premios: form.premios.map(p => ({
            ...p,
            monto: Number(p.monto || 0),
            cantidadTotal: Number(p.cantidadTotal || 0),
            desbloqueoPorVentas: Number(p.desbloqueoPorVentas || 0),
          })),
        }),
      });

      if (!res.ok) throw new Error("Error creando caja");

      const data = await res.json();
      alert("Caja creada ✅");

      setCajas(prev => [...prev, { id: data.id, ...form }]);
      setForm({
        nombre: "",
        totalCajas: "",
        precioCaja: "",
        estado: "activa",
        premios: form.premios.map(p => ({ ...p, monto: "", cantidadTotal: "", desbloqueoPorVentas: "" })),
      });
    } catch (e) {
      console.error(e);
      alert("Error creando caja");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 text-white space-y-10">
      <h1 className="text-3xl font-extrabold">Admin · Cajas</h1>

      {/* CREAR CAJA */}
      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 space-y-4">
        <h2 className="text-yellow-400 font-bold text-xl">Crear caja</h2>

        <div className="grid md:grid-cols-4 gap-4">
          <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre"
            className="p-3 bg-black border border-zinc-700 rounded" />
          <input name="totalCajas" type="number" value={form.totalCajas} onChange={handleChange} placeholder="Stock"
            className="p-3 bg-black border border-zinc-700 rounded" />
          <input name="precioCaja" type="number" value={form.precioCaja} onChange={handleChange} placeholder="Precio"
            className="p-3 bg-black border border-zinc-700 rounded" />
          <select name="estado" value={form.estado} onChange={handleChange}
            className="p-3 bg-black border border-zinc-700 rounded">
            <option value="activa">Activa</option>
            <option value="pausada">Pausada</option>
            <option value="cerrada">Cerrada</option>
          </select>
        </div>

        <h3 className="text-yellow-400 font-bold mt-4">🎁 Premios</h3>
        {form.premios.map((p, i) => (
          <div key={i} className="grid md:grid-cols-4 gap-2 mb-2">
            <input value={p.nombre} disabled className="p-2 bg-black/40 rounded border border-white/10" />
            <input type="number" placeholder="Monto" value={p.monto}
              onChange={e => handlePremioChange(i, "monto", e.target.value)}
              className="p-2 bg-black/40 rounded border border-white/10" />
            <input type="number" placeholder="Cantidad" value={p.cantidadTotal}
              onChange={e => handlePremioChange(i, "cantidadTotal", e.target.value)}
              className="p-2 bg-black/40 rounded border border-white/10" />
            <input type="number" placeholder="Sale en venta #" value={p.desbloqueoPorVentas}
              onChange={e => handlePremioChange(i, "desbloqueoPorVentas", e.target.value)}
              className="p-2 bg-black/40 rounded border border-white/10" />
          </div>
        ))}

        <div className="flex justify-end">
          <button onClick={handleCrearCaja} disabled={saving}
            className="bg-yellow-500 text-black px-6 py-3 rounded-xl font-bold">
            {saving ? "Creando..." : "Crear caja"}
          </button>
        </div>
      </div>

      {/* LISTADO */}
      <div>
        <h2 className="text-yellow-400 font-bold text-xl mb-4">Cajas existentes</h2>
        {cajas.map(c => (
          <div key={c.id}
            onClick={() => setSelectedCaja(c)}
            className="p-4 bg-zinc-800 border border-zinc-700 rounded mb-2 cursor-pointer">
            <strong>{c.nombre}</strong>
            <div className="text-sm text-gray-400">
              Stock: {c.totalCajas} · Estado: {c.estado}
            </div>
          </div>
        ))}
      </div>

      {/* PACKS */}
      {selectedCaja && (
        <div>
          <h2 className="text-yellow-400 font-bold text-xl mb-2">
            Packs · {selectedCaja.nombre}
          </h2>
          <AdminPacks cajaId={selectedCaja.id} />
        </div>
      )}
    </div>
  );
}
