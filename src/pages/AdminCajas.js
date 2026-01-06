// FILE: web/sorteos-lxm/src/pages/AdminCajas.js
import { useState, useEffect } from "react";
import API_URL from "../config/api";
import AdminPacks from "../components/AdminPacks"; // tu componente para manejar packs de compra

export default function AdminCajas() {
  const [form, setForm] = useState({
    nombre: "",
    totalCajas: "",
    precioCaja: "",
    estado: "activa",
    premios: [
      { nombre: "Premio Mayor", monto: "", cantidadTotal: "", desbloqueoPorVentas: "", visible: true, esMayor: true },
      { nombre: "Premio $20.000", monto: "", cantidadTotal: "", desbloqueoPorVentas: "", visible: true, esMayor: false },
      { nombre: "Premio $10.000", monto: "", cantidadTotal: "", desbloqueoPorVentas: "", visible: true, esMayor: false },
      { nombre: "Créditos", monto: "", cantidadTotal: "", desbloqueoPorVentas: "", visible: true, esMayor: false },
    ],
    packs: [],
  });

  const [saving, setSaving] = useState(false);
  const [cajas, setCajas] = useState([]);
  const [selectedCaja, setSelectedCaja] = useState(null);

  // 🔹 Cargar cajas existentes al inicio
  useEffect(() => {
    const loadCajas = async () => {
      try {
        const res = await fetch(`${API_URL}/admin/cajas`);
        const data = await res.json();
        setCajas(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error cargando cajas:", err);
      }
    };
    loadCajas();
  }, []);

  /* =========================
     Cambios generales de la caja
  ========================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* =========================
     PREMIOS
  ========================= */
  const handlePremioChange = (index, field, value) => {
    setForm((prev) => {
      const premios = [...prev.premios];
      premios[index][field] = field === "visible" ? Boolean(value) : value;
      return { ...prev, premios };
    });
  };

  /* =========================
     PACKS DINÁMICOS
  ========================= */
  const addPack = () => {
    setForm((prev) => ({
      ...prev,
      packs: [...prev.packs, { cantidad: "", precio: "", destacado: false, activo: true }],
    }));
  };

  const removePack = (index) => {
    setForm((prev) => ({ ...prev, packs: prev.packs.filter((_, i) => i !== index) }));
  };

  const handlePackChange = (index, field, value) => {
    setForm((prev) => {
      const packs = [...prev.packs];
      packs[index][field] = field === "destacado" || field === "activo" ? Boolean(value) : value;
      return { ...prev, packs };
    });
  };

  /* =========================
     CREAR CAJA
  ========================= */
  const handleCrearCaja = async () => {
    if (!form.nombre) return alert("Completa el nombre de la caja");
    if (!form.totalCajas || Number(form.totalCajas) <= 0)
      return alert("Completa el stock total de cajas");

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
          packs: form.packs.map(p => ({
            ...p,
            cantidad: Number(p.cantidad || 0),
            precio: Number(p.precio || 0),
          })),
        }),
      });

      if (!res.ok) throw new Error("Error creando la caja");

      const data = await res.json();
      alert("Caja creada correctamente ✅");

      // actualizar listado y seleccionar la caja creada
      const nuevaCaja = { id: data.id, ...form };
      setCajas(prev => [...prev, nuevaCaja]);
      setSelectedCaja(nuevaCaja);

      // reset form
      setForm({
        nombre: "",
        totalCajas: "",
        precioCaja: "",
        estado: "activa",
        premios: [
          { nombre: "Premio Mayor", monto: "", cantidadTotal: "", desbloqueoPorVentas: "", visible: true, esMayor: true },
          { nombre: "Premio $20.000", monto: "", cantidadTotal: "", desbloqueoPorVentas: "", visible: true, esMayor: false },
          { nombre: "Premio $10.000", monto: "", cantidadTotal: "", desbloqueoPorVentas: "", visible: true, esMayor: false },
          { nombre: "Créditos", monto: "", cantidadTotal: "", desbloqueoPorVentas: "", visible: true, esMayor: false },
        ],
        packs: [],
      });
    } catch (err) {
      console.error(err);
      alert("Error creando la caja");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 text-white space-y-8">
      <h1 className="text-3xl font-extrabold">Cajas Admin</h1>

      {/* CREAR NUEVA CAJA */}
      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 space-y-4">
        <h2 className="text-xl font-bold text-yellow-400">Crear Nueva Caja</h2>
        {/* input nombre, stock, precio, estado */}
        <div className="grid md:grid-cols-4 gap-4">
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre de la caja"
            className="w-full p-3 rounded bg-black border border-zinc-700"
          />
          <input
            type="number"
            name="totalCajas"
            value={form.totalCajas}
            onChange={handleChange}
            placeholder="Stock total"
            className="w-full p-3 rounded bg-black border border-zinc-700"
          />
          <input
            type="number"
            name="precioCaja"
            value={form.precioCaja}
            onChange={handleChange}
            placeholder="Precio"
            className="w-full p-3 rounded bg-black border border-zinc-700"
          />
          <select
            name="estado"
            value={form.estado}
            onChange={handleChange}
            className="w-full p-3 rounded bg-black border border-zinc-700"
          >
            <option value="activa">Activa</option>
            <option value="pausada">Pausada</option>
            <option value="cerrada">Cerrada</option>
          </select>
        </div>

        {/* PREMIOS */}
        <div className="mt-4">
          <h3 className="text-yellow-400 font-bold mb-2">🎁 Premios</h3>
          {form.premios.map((p, i) => (
            <div key={i} className="grid md:grid-cols-5 gap-2 mb-2 bg-zinc-800 p-2 rounded border border-zinc-700">
              <input
                placeholder="Nombre"
                value={p.nombre}
                onChange={e => handlePremioChange(i, "nombre", e.target.value)}
                className="p-2 rounded bg-black/40 border border-white/10"
              />
              <input
                type="number"
                placeholder="Monto"
                value={p.monto}
                onChange={e => handlePremioChange(i, "monto", e.target.value)}
                className="p-2 rounded bg-black/40 border border-white/10"
              />
              <input
                type="number"
                placeholder="Cantidad total"
                value={p.cantidadTotal}
                onChange={e => handlePremioChange(i, "cantidadTotal", e.target.value)}
                className="p-2 rounded bg-black/40 border border-white/10"
              />
              <input
                type="number"
                placeholder="Desbloqueo por venta #"
                value={p.desbloqueoPorVentas}
                onChange={e => handlePremioChange(i, "desbloqueoPorVentas", e.target.value)}
                className="p-2 rounded bg-black/40 border border-white/10"
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={p.visible}
                  onChange={e => handlePremioChange(i, "visible", e.target.checked)}
                />
                Visible
              </label>
            </div>
          ))}
        </div>

        {/* PACKS */}
        <div className="mt-4">
          <h3 className="text-yellow-400 font-bold mb-2">💰 Packs de compra</h3>
          {form.packs.map((pack, i) => (
            <div key={i} className="grid md:grid-cols-4 gap-2 mb-2 bg-zinc-800 p-2 rounded border border-zinc-700">
              <input
                type="number"
                placeholder="Cantidad"
                value={pack.cantidad}
                onChange={e => handlePackChange(i, "cantidad", e.target.value)}
                className="p-2 rounded bg-black/40 border border-white/10"
              />
              <input
                type="number"
                placeholder="Precio"
                value={pack.precio}
                onChange={e => handlePackChange(i, "precio", e.target.value)}
                className="p-2 rounded bg-black/40 border border-white/10"
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={pack.destacado}
                  onChange={e => handlePackChange(i, "destacado", e.target.checked)}
                />
                Destacado
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={pack.activo}
                  onChange={e => handlePackChange(i, "activo", e.target.checked)}
                />
                Activo
              </label>
              <button onClick={() => removePack(i)} className="text-red-500 text-sm mt-1">❌ Eliminar</button>
            </div>
          ))}
          <button onClick={addPack} className="bg-yellow-400 text-black px-3 py-1 rounded mt-2 font-bold">➕ Agregar pack</button>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleCrearCaja}
            disabled={saving}
            className="bg-yellow-500 text-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-400 disabled:opacity-50"
          >
            {saving ? "Creando..." : "Crear caja"}
          </button>
        </div>
      </div>

      {/* LISTADO DE CAJAS EXISTENTES */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-yellow-400 mb-4">Cajas existentes</h2>
        {cajas.length === 0 && <p>No hay cajas creadas aún.</p>}
        {cajas.map(c => (
          <div key={c.id} className="p-4 mb-2 bg-zinc-800 rounded border border-zinc-700 cursor-pointer" onClick={() => setSelectedCaja(c)}>
            <p className="font-bold">{c.nombre || c.titulo}</p>
            <p className="text-gray-400 text-sm">
              Total: {c.totalCajas} · Vendidas: {c.cajasVendidas || 0} · Estado: {c.estado}
            </p>
          </div>
        ))}
      </div>

      {/* ADMIN PACKS DE LA CAJA SELECCIONADA */}
      {selectedCaja && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold text-yellow-400 mb-2">
            Packs de la caja: {selectedCaja.nombre || selectedCaja.titulo}
          </h2>
          <AdminPacks cajaId={selectedCaja.id} />
        </div>
      )}
    </div>
  );
}
