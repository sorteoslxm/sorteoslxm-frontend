import React, { useEffect, useState } from "react";
import API_URL from "../../config/api";

const PREMIO_BASE = () => ({
  nombre: "",
  monto: "",
  cantidadTotal: 1,
  desbloqueoPorVentas: "",
  desbloqueado: false,
  visible: true
});

export default function AdminCajas() {
  const [cajas, setCajas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    titulo: "",
    slug: "",
    precioCaja: "",
    totalCajas: "",
    premios: [
      { ...PREMIO_BASE(), nombre: "Créditos", desbloqueado: true },
      { ...PREMIO_BASE(), nombre: "Premios $10.000" },
      { ...PREMIO_BASE(), nombre: "Premios $20.000" },
      { ...PREMIO_BASE(), nombre: "Premio Mayor" }
    ]
  });

  /* =============================
     LOAD
  ============================== */
  const loadCajas = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/cajas`);
      const data = await res.json();
      setCajas(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCajas();
  }, []);

  /* =============================
     FORM HANDLERS
  ============================== */
  const handleChange = e => {
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
    if (!form.titulo || !form.slug || !form.totalCajas || !form.precioCaja) {
      alert("Faltan datos");
      return;
    }

    const payload = {
      titulo: form.titulo,
      slug: form.slug,
      precioCaja: Number(form.precioCaja),
      totalCajas: Number(form.totalCajas),
      premios: form.premios.map(p => ({
        ...p,
        monto: Number(p.monto || 0),
        cantidadTotal: Number(p.cantidadTotal || 1),
        desbloqueoPorVentas:
          p.desbloqueoPorVentas === ""
            ? null
            : Number(p.desbloqueoPorVentas)
      }))
    };

    const res = await fetch(`${API_URL}/admin/cajas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      setForm({
        titulo: "",
        slug: "",
        precioCaja: "",
        totalCajas: "",
        premios: [
          { ...PREMIO_BASE(), nombre: "Créditos", desbloqueado: true },
          { ...PREMIO_BASE(), nombre: "Premios $10.000" },
          { ...PREMIO_BASE(), nombre: "Premios $20.000" },
          { ...PREMIO_BASE(), nombre: "Premio Mayor" }
        ]
      });
      loadCajas();
    } else {
      alert("Error creando caja");
    }
  };

  /* =============================
     CERRAR CAJA
  ============================== */
  const cerrarCaja = async id => {
    if (!window.confirm("¿Cerrar esta caja?")) return;
    await fetch(`${API_URL}/admin/cajas/${id}/cerrar`, { method: "PUT" });
    loadCajas();
  };

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-extrabold mb-8">📦 Admin · Cajas</h1>

      {/* =============================
         CREAR CAJA
      ============================== */}
      <div className="bg-black/40 p-6 rounded-2xl mb-12">
        <h2 className="text-xl font-bold mb-6">➕ Nueva caja</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <input
            name="titulo"
            placeholder="Título"
            value={form.titulo}
            onChange={handleChange}
            className="p-3 rounded text-black"
          />
          <input
            name="slug"
            placeholder="Slug (100k)"
            value={form.slug}
            onChange={handleChange}
            className="p-3 rounded text-black"
          />
          <input
            name="precioCaja"
            placeholder="Precio caja"
            value={form.precioCaja}
            onChange={handleChange}
            className="p-3 rounded text-black"
          />
          <input
            name="totalCajas"
            placeholder="Total cajas"
            value={form.totalCajas}
            onChange={handleChange}
            className="p-3 rounded text-black"
          />
        </div>

        {/* PREMIOS */}
        <h3 className="font-bold mb-4">🎁 Premios</h3>

        <div className="space-y-4">
          {form.premios.map((p, i) => (
            <div
              key={i}
              className="bg-black/30 p-4 rounded-xl grid grid-cols-1 md:grid-cols-6 gap-3"
            >
              <input
                placeholder="Nombre"
                value={p.nombre}
                onChange={e =>
                  handlePremioChange(i, "nombre", e.target.value)
                }
                className="p-2 rounded text-black"
              />
              <input
                placeholder="Monto"
                value={p.monto}
                onChange={e =>
                  handlePremioChange(i, "monto", e.target.value)
                }
                className="p-2 rounded text-black"
              />
              <input
                placeholder="Cantidad"
                value={p.cantidadTotal}
                onChange={e =>
                  handlePremioChange(i, "cantidadTotal", e.target.value)
                }
                className="p-2 rounded text-black"
              />
              <input
                placeholder="Desbloquear en ventas"
                value={p.desbloqueoPorVentas || ""}
                onChange={e =>
                  handlePremioChange(i, "desbloqueoPorVentas", e.target.value)
                }
                className="p-2 rounded text-black"
              />

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={p.desbloqueado}
                  onChange={e =>
                    handlePremioChange(i, "desbloqueado", e.target.checked)
                  }
                />
                Desbloqueado
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={p.visible}
                  onChange={e =>
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
          className="mt-6 bg-yellow-400 text-black px-8 py-3 rounded-xl font-extrabold"
        >
          Crear caja
        </button>
      </div>

      {/* =============================
         LISTADO
      ============================== */}
      {loading ? (
        <p>Cargando…</p>
      ) : (
        <div className="space-y-4">
          {cajas.map(c => (
            <div
              key={c.id}
              className="bg-black/50 p-5 rounded-2xl flex justify-between items-center"
            >
              <div>
                <div className="font-bold text-lg">{c.titulo}</div>
                <div className="text-sm text-gray-300">
                  {c.slug} · {c.cajasVendidas}/{c.totalCajas}
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold ${
                    c.estado === "activa"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  {c.estado.toUpperCase()}
                </span>

                {c.estado === "activa" && (
                  <button
                    onClick={() => cerrarCaja(c.id)}
                    className="bg-red-500 px-4 py-2 rounded-lg font-bold"
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
  );
}
