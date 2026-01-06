// FILE: web/sorteos-lxm/src/pages/AdminCajas.js
import { useState, useEffect } from "react";
import API_URL from "../config/api";
import AdminPacks from "../components/AdminPacks";

const emptyForm = {
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
};

export default function AdminCajas() {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [cajas, setCajas] = useState([]);
  const [selectedCaja, setSelectedCaja] = useState(null);
  const [editandoId, setEditandoId] = useState(null);

  const loadCajas = async () => {
    const res = await fetch(`${API_URL}/admin/cajas`);
    const data = await res.json();
    setCajas(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadCajas();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handlePremioChange = (i, field, value) => {
    setForm((p) => {
      const premios = [...p.premios];
      premios[i][field] = value;
      return { ...p, premios };
    });
  };

  const normalizarForm = () => ({
    ...form,
    totalCajas: Number(form.totalCajas),
    precioCaja: Number(form.precioCaja || 0),
    premios: form.premios.map((p) => ({
      ...p,
      monto: Number(p.monto || 0),
      cantidadTotal: Number(p.cantidadTotal || 0),
      desbloqueoPorVentas: Number(p.desbloqueoPorVentas || 0),
    })),
  });

  const handleSubmit = async () => {
    if (!form.nombre || !form.totalCajas) {
      return alert("Completa nombre y stock");
    }

    setSaving(true);
    try {
      const url = editandoId
        ? `${API_URL}/admin/cajas/${editandoId}`
        : `${API_URL}/admin/cajas`;

      const method = editandoId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalizarForm()),
      });

      if (!res.ok) throw new Error("Error guardando caja");

      alert(editandoId ? "Caja actualizada ✅" : "Caja creada ✅");

      setForm(emptyForm);
      setEditandoId(null);
      setSelectedCaja(null);
      await loadCajas();
    } catch (e) {
      console.error(e);
      alert("Error guardando caja");
    } finally {
      setSaving(false);
    }
  };

  const handleEditarCaja = (caja) => {
    setEditandoId(caja.id);
    setForm({
      ...caja,
      totalCajas: caja.totalCajas || "",
      precioCaja: caja.precioCaja || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCerrarCaja = async (id) => {
    if (!window.confirm("¿Cerrar esta caja?")) return;

    await fetch(`${API_URL}/admin/cajas/${id}/cerrar`, { method: "PUT" });
    await loadCajas();
  };

  return (
    <div className="max-w-6xl mx-auto p-8 text-white space-y-10">
      <h1 className="text-3xl font-extrabold">Admin · Cajas</h1>

      {/* FORM */}
      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 space-y-4">
        <h2 className="text-yellow-400 font-bold text-xl">
          {editandoId ? "Editar caja" : "Crear caja"}
        </h2>

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
              onChange={(e) => handlePremioChange(i, "monto", e.target.value)}
              className="p-2 bg-black/40 rounded border border-white/10" />
            <input type="number" placeholder="Cantidad" value={p.cantidadTotal}
              onChange={(e) => handlePremioChange(i, "cantidadTotal", e.target.value)}
              className="p-2 bg-black/40 rounded border border-white/10" />
            <input type="number" placeholder="Sale en venta #" value={p.desbloqueoPorVentas}
              onChange={(e) => handlePremioChange(i, "desbloqueoPorVentas", e.target.value)}
              className="p-2 bg-black/40 rounded border border-white/10" />
          </div>
        ))}

        <div className="flex justify-end gap-2">
          {editandoId && (
            <button
              onClick={() => {
                setEditandoId(null);
                setForm(emptyForm);
              }}
              className="px-4 py-2 border border-zinc-600 rounded"
            >
              Cancelar
            </button>
          )}

          <button onClick={handleSubmit} disabled={saving}
            className="bg-yellow-500 text-black px-6 py-3 rounded-xl font-bold">
            {saving ? "Guardando..." : editandoId ? "Guardar cambios" : "Crear caja"}
          </button>
        </div>
      </div>

      {/* LISTADO */}
      <div>
        <h2 className="text-yellow-400 font-bold text-xl mb-4">Cajas existentes</h2>
        {cajas.map((c) => (
          <div key={c.id} className="p-4 bg-zinc-800 border border-zinc-700 rounded mb-2">
            <div
              onClick={() => setSelectedCaja(c)}
              className="cursor-pointer"
            >
              <strong>{c.nombre}</strong>
              <div className="text-sm text-gray-400">
                Stock: {c.totalCajas} · Estado: {c.estado}
              </div>
            </div>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleEditarCaja(c)}
                className="text-sm px-3 py-1 border rounded"
              >
                Editar
              </button>

              {c.estado !== "cerrada" && (
                <button
                  onClick={() => handleCerrarCaja(c.id)}
                  className="text-sm px-3 py-1 border border-red-500 text-red-400 rounded"
                >
                  Cerrar
                </button>
              )}
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
