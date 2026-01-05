// FILE: web/sorteos-lxm/src/pages/AdminCajas.js
import { useState } from "react";
import API_URL from "../config/api";

export default function AdminCajas() {
  const [form, setForm] = useState({
    nombre: "",
    totalCajas: "",
    precioCaja: "",
    estado: "activa",
    premios: [
      {
        nombre: "Premio Mayor",
        monto: "",
        cantidadTotal: "",
        desbloqueoPorVentas: "",
        visible: true,
        esMayor: true,
      },
      {
        nombre: "Premio $20.000",
        monto: "",
        cantidadTotal: "",
        desbloqueoPorVentas: "",
        visible: true,
        esMayor: false,
      },
      {
        nombre: "Premio $10.000",
        monto: "",
        cantidadTotal: "",
        desbloqueoPorVentas: "",
        visible: true,
        esMayor: false,
      },
      {
        nombre: "Créditos",
        monto: "",
        cantidadTotal: "",
        desbloqueoPorVentas: "",
        visible: true,
        esMayor: false,
      },
    ],
    packs: [],
  });

  const [saving, setSaving] = useState(false);

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
      premios[index][field] =
        field === "visible" ? Boolean(value) : value;
      return { ...prev, premios };
    });
  };

  /* =========================
     PACKS DINÁMICOS
  ========================= */
  const addPack = () => {
    setForm((prev) => ({
      ...prev,
      packs: [
        ...prev.packs,
        { cantidad: "", precio: "", destacado: false, activo: true },
      ],
    }));
  };

  const removePack = (index) => {
    setForm((prev) => ({
      ...prev,
      packs: prev.packs.filter((_, i) => i !== index),
    }));
  };

  const handlePackChange = (index, field, value) => {
    setForm((prev) => {
      const packs = [...prev.packs];
      packs[index][field] = field === "destacado" || field === "activo" ? Boolean(value) : value;
      return { ...prev, packs };
    });
  };

  /* =========================
     GUARDAR TODO
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

      alert("Caja creada correctamente ✅");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Error creando la caja");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 text-white space-y-8">
      <h2 className="text-3xl font-extrabold">Crear Nueva Caja</h2>

      {/* DATOS GENERALES */}
      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 space-y-4">
        <div>
          <label className="block text-sm mb-1">Nombre de la caja</label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Ej: Caja Enero 2026"
            className="w-full p-3 rounded bg-black border border-zinc-700"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm mb-1">Stock total de cajas</label>
            <input
              type="number"
              name="totalCajas"
              value={form.totalCajas}
              onChange={handleChange}
              placeholder="Ej: 500"
              className="w-full p-3 rounded bg-black border border-zinc-700"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Precio de la caja</label>
            <input
              type="number"
              name="precioCaja"
              value={form.precioCaja}
              onChange={handleChange}
              placeholder="Ej: 1000"
              className="w-full p-3 rounded bg-black border border-zinc-700"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Estado</label>
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
        </div>
      </div>

      {/* PREMIOS */}
      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 space-y-4">
        <h3 className="text-xl font-bold text-yellow-400 mb-2">🎁 Premios</h3>

        {form.premios.map((p, i) => (
          <div key={i} className="bg-zinc-800 p-4 rounded-xl border border-zinc-700 space-y-2">
            <div className="grid md:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder="Nombre del premio"
                value={p.nombre}
                onChange={(e) => handlePremioChange(i, "nombre", e.target.value)}
                className="bg-black p-2 rounded"
              />
              <input
                type="number"
                placeholder="Monto"
                value={p.monto}
                onChange={(e) => handlePremioChange(i, "monto", e.target.value)}
                className="bg-black p-2 rounded"
              />
              <input
                type="number"
                placeholder="Cantidad total"
                value={p.cantidadTotal}
                onChange={(e) => handlePremioChange(i, "cantidadTotal", e.target.value)}
                className="bg-black p-2 rounded"
              />
              <input
                type="number"
                placeholder="Desbloqueo por venta #"
                value={p.desbloqueoPorVentas}
                onChange={(e) => handlePremioChange(i, "desbloqueoPorVentas", e.target.value)}
                className="bg-black p-2 rounded"
              />
            </div>

            <label className="flex items-center gap-2 text-sm mt-2">
              <input
                type="checkbox"
                checked={p.visible}
                onChange={(e) => handlePremioChange(i, "visible", e.target.checked)}
              />
              Visible
            </label>
          </div>
        ))}
      </div>

      {/* PACKS */}
      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 space-y-4">
        <h3 className="text-xl font-bold text-yellow-400 mb-2">💰 Packs de compra</h3>

        {form.packs.map((pack, index) => (
          <div key={index} className="bg-zinc-800 p-4 rounded-xl border border-zinc-700 space-y-2">
            <div className="grid md:grid-cols-4 gap-3">
              <input
                type="number"
                placeholder="Cantidad de chances"
                value={pack.cantidad}
                onChange={(e) => handlePackChange(index, "cantidad", e.target.value)}
                className="bg-black p-2 rounded"
              />
              <input
                type="number"
                placeholder="Precio"
                value={pack.precio}
                onChange={(e) => handlePackChange(index, "precio", e.target.value)}
                className="bg-black p-2 rounded"
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={pack.destacado}
                  onChange={(e) => handlePackChange(index, "destacado", e.target.checked)}
                />
                Destacado
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={pack.activo}
                  onChange={(e) => handlePackChange(index, "activo", e.target.checked)}
                />
                Activo
              </label>
            </div>
            <button
              onClick={() => removePack(index)}
              className="text-red-500 text-sm mt-2"
            >
              ❌ Eliminar pack
            </button>
          </div>
        ))}

        <button
          onClick={addPack}
          className="bg-yellow-400 text-black font-bold px-4 py-2 rounded"
        >
          ➕ Agregar pack
        </button>
      </div>

      {/* BOTÓN CREAR */}
      <div className="flex justify-end">
        <button
          onClick={handleCrearCaja}
          disabled={saving}
          className="bg-yellow-500 text-black font-bold px-6 py-3 rounded-xl hover:bg-yellow-400 disabled:opacity-50"
        >
          {saving ? "Creando..." : "Crear caja"}
        </button>
      </div>
    </div>
  );
}
