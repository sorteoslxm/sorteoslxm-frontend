// FILE: web/sorteos-lxm/src/pages/AdminCajas.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

/* =============================
   PREMIO BASE
============================== */
const PREMIO_BASE = () => ({
  nombre: "",
  monto: "",
  cantidadTotal: 1,
  desbloqueoPorVentas: "",
  desbloqueado: false,
  visible: true,
});

export default function AdminCajas() {
  const navigate = useNavigate();

  const [cajas, setCajas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    titulo: "",
    slug: "",
    precioCaja: "",
    totalCajas: "",
    premios: [
      { ...PREMIO_BASE(), nombre: "Créditos", desbloqueado: true },
      { ...PREMIO_BASE(), nombre: "Premios $10.000" },
      { ...PREMIO_BASE(), nombre: "Premios $20.000" },
      { ...PREMIO_BASE(), nombre: "Premio Mayor" },
    ],
  });

  /* =============================
     LOAD CAJAS
  ============================== */
  const loadCajas = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/cajas`, {
        credentials: "include",
      });
      const data = await res.json();
      setCajas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando cajas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCajas();
  }, []);

  /* =============================
     HANDLERS
  ============================== */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePremioChange = (index, field, value) => {
    const premios = [...form.premios];
    premios[index][field] = value;
    setForm({ ...form, premios });
  };

  /* =============================
     CREAR CAJA
  ============================== */
  const crearCaja = async () => {
    if (!form.titulo || !form.slug || !form.precioCaja || !form.totalCajas) {
      alert("Completá todos los campos principales");
      return;
    }

    setCreating(true);

    const payload = {
      titulo: form.titulo,
      slug: form.slug,
      precioCaja: Number(form.precioCaja),
      totalCajas: Number(form.totalCajas),
      premios: form.premios.map((p) => ({
        ...p,
        monto: Number(p.monto || 0),
        cantidadTotal: Number(p.cantidadTotal || 1),
        desbloqueoPorVentas:
          p.desbloqueoPorVentas === "" ? null : Number(p.desbloqueoPorVentas),
      })),
    };

    try {
      const res = await fetch(`${API_URL}/admin/cajas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error creando caja");

      alert("Caja creada correctamente");

      setForm({
        titulo: "",
        slug: "",
        precioCaja: "",
        totalCajas: "",
        premios: [
          { ...PREMIO_BASE(), nombre: "Créditos", desbloqueado: true },
          { ...PREMIO_BASE(), nombre: "Premios $10.000" },
          { ...PREMIO_BASE(), nombre: "Premios $20.000" },
          { ...PREMIO_BASE(), nombre: "Premio Mayor" },
        ],
      });

      loadCajas();
    } catch (err) {
      console.error(err);
      alert("No se pudo crear la caja");
    } finally {
      setCreating(false);
    }
  };

  /* =============================
     CAMBIAR ESTADO
  ============================== */
  const cambiarEstado = async (id, estado) => {
    if (
      estado === "cerrada" &&
      !window.confirm("¿Cerrar esta caja definitivamente?")
    )
      return;

    await fetch(`${API_URL}/admin/cajas/${id}/estado`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ estado }),
    });

    loadCajas();
  };

  return (
    <div className="p-8 text-white space-y-14">
      <h1 className="text-3xl font-extrabold">📦 Admin · Cajas</h1>

      {/* =============================
         FORM CREAR CAJA
      ============================== */}
      <div className="bg-zinc-900 rounded-2xl p-6 shadow-xl space-y-6">
        <h2 className="text-2xl font-bold">➕ Crear nueva caja</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            placeholder="Título"
            className="bg-zinc-800 p-3 rounded"
          />

          <input
            name="slug"
            value={form.slug}
            onChange={handleChange}
            placeholder="Slug (ej: 100k)"
            className="bg-zinc-800 p-3 rounded"
          />

          <input
            name="precioCaja"
            type="number"
            value={form.precioCaja}
            onChange={handleChange}
            placeholder="Precio de la caja"
            className="bg-zinc-800 p-3 rounded"
          />

          <input
            name="totalCajas"
            type="number"
            value={form.totalCajas}
            onChange={handleChange}
            placeholder="Total de cajas"
            className="bg-zinc-800 p-3 rounded"
          />
        </div>

        <h3 className="text-xl font-bold">🎁 Premios</h3>

        <div className="space-y-4">
          {form.premios.map((p, i) => (
            <div
              key={i}
              className="bg-zinc-800 p-4 rounded-xl grid md:grid-cols-5 gap-3"
            >
              <input
                value={p.nombre}
                onChange={(e) =>
                  handlePremioChange(i, "nombre", e.target.value)
                }
                className="bg-black p-2 rounded"
              />

              <input
                type="number"
                value={p.monto}
                onChange={(e) =>
                  handlePremioChange(i, "monto", e.target.value)
                }
                className="bg-black p-2 rounded"
              />

              <input
                type="number"
                value={p.cantidadTotal}
                onChange={(e) =>
                  handlePremioChange(i, "cantidadTotal", e.target.value)
                }
                className="bg-black p-2 rounded"
              />

              <input
                type="number"
                value={p.desbloqueoPorVentas || ""}
                onChange={(e) =>
                  handlePremioChange(
                    i,
                    "desbloqueoPorVentas",
                    e.target.value
                  )
                }
                className="bg-black p-2 rounded"
              />

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={p.visible}
                  onChange={(e) =>
                    handlePremioChange(i, "visible", e.target.checked)
                  }
                />
                Visible
              </label>
            </div>
          ))}
        </div>

        <button
          onClick={crearCaja}
          disabled={creating}
          className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-extrabold"
        >
          {creating ? "Creando..." : "Crear caja"}
        </button>
      </div>

      {/* =============================
         LISTADO CAJAS
      ============================== */}
      <div>
        <h2 className="text-2xl font-bold mb-4">📦 Cajas creadas</h2>

        {loading ? (
          <p>Cargando…</p>
        ) : cajas.length === 0 ? (
          <p className="text-gray-400">Todavía no hay cajas creadas.</p>
        ) : (
          <div className="space-y-4">
            {cajas.map((c) => (
              <div
                key={c.id}
                className="bg-black/60 p-5 rounded-2xl flex justify-between items-center"
              >
                <div>
                  <div className="font-bold text-lg">{c.titulo}</div>
                  <div className="text-sm text-gray-300">
                    /cajas/{c.slug} · {c.cajasVendidas}/{c.totalCajas}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold ${
                      c.estado === "activa"
                        ? "bg-green-500"
                        : c.estado === "pausada"
                        ? "bg-yellow-500 text-black"
                        : "bg-red-600"
                    }`}
                  >
                    {c.estado.toUpperCase()}
                  </span>

                  <button
                    onClick={() =>
                      navigate(`/admin/cajas/editar/${c.id}`)
                    }
                    className="bg-blue-600 px-3 py-1 rounded font-bold"
                  >
                    Editar
                  </button>

                  {c.estado !== "activa" && (
                    <button
                      onClick={() => cambiarEstado(c.id, "activa")}
                      className="bg-green-600 px-3 py-1 rounded font-bold"
                    >
                      Activar
                    </button>
                  )}

                  {c.estado === "activa" && (
                    <button
                      onClick={() => cambiarEstado(c.id, "pausada")}
                      className="bg-yellow-600 text-black px-3 py-1 rounded font-bold"
                    >
                      Pausar
                    </button>
                  )}

                  {c.estado !== "cerrada" && (
                    <button
                      onClick={() => cambiarEstado(c.id, "cerrada")}
                      className="bg-red-700 px-3 py-1 rounded font-bold"
                    >
                      Cerrar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
