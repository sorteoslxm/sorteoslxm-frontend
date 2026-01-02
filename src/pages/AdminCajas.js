import React, { useEffect, useState } from "react";
import API_URL from "../config/api"; // ✅ IMPORT CORRECTO

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
      setCajas(Array.isArray(data) ? data : []);
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

              <span
                className={`px-3 py-1 rounded-full text-sm font-bold ${
                  c.estado === "activa"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              >
                {c.estado.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
