// FILE: src/pages/AdminEditarCaja.js
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_URL from "../config/api";
import AdminPacks from "../components/AdminPacks";

export default function AdminEditarCaja() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [caja, setCaja] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCaja = async () => {
      try {
        const res = await fetch(`${API_URL}/admin/cajas/${id}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error("Error cargando caja");
        // Aseguramos que premios exista
        if (!data.premios) data.premios = [];
        setCaja(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCaja();
  }, [id]);

  /* ================================
     CAMBIOS GENERALES DE LA CAJA
  ================================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCaja((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ================================
     CAMBIOS EN PREMIOS
  ================================= */
  const handlePremioChange = (index, field, value) => {
    setCaja((prev) => {
      const premios = [...prev.premios];
      premios[index] = {
        ...premios[index],
        [field]: field === "visible" ? value : Number(value),
      };
      return { ...prev, premios };
    });
  };

  /* ================================
     GUARDAR CAJA
  ================================= */
  const handleSave = async () => {
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/admin/cajas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(caja),
      });

      if (!res.ok) throw new Error("Error guardando caja");

      navigate("/admin/cajas");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-white">Cargando caja…</div>;
  if (error) return <div className="p-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto p-8 text-white space-y-10">
      <h1 className="text-3xl font-extrabold mb-8">Editar Caja</h1>

      {/* DATOS GENERALES */}
      <div className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/10">
        <div>
          <label className="block text-sm mb-1">Título</label>
          <input
            name="nombre"
            value={caja.nombre || ""}
            onChange={handleChange}
            className="w-full p-3 rounded bg-black/40 border border-white/10"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm mb-1">Precio de la caja</label>
            <input
              type="number"
              name="precioCaja"
              value={caja.precioCaja || 0}
              onChange={handleChange}
              className="w-full p-3 rounded bg-black/40 border border-white/10"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Total de cajas</label>
            <input
              type="number"
              name="totalCajas"
              value={caja.totalCajas || 0}
              onChange={handleChange}
              className="w-full p-3 rounded bg-black/40 border border-white/10"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Estado</label>
          <select
            name="estado"
            value={caja.estado}
            onChange={handleChange}
            className="w-full p-3 rounded bg-black/40 border border-white/10"
          >
            <option value="activa">Activa</option>
            <option value="pausada">Pausada</option>
            <option value="cerrada">Cerrada</option>
          </select>
        </div>
      </div>

      {/* PREMIOS */}
      <h2 className="text-2xl font-extrabold mb-4">Premios</h2>

      <div className="space-y-6">
        {caja.premios.map((premio, index) => (
          <div
            key={index}
            className="bg-black/40 p-6 rounded-2xl border border-white/10"
          >
            <h3 className="text-xl font-bold text-yellow-400 mb-4">
              {premio.nombre}
            </h3>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs mb-1">Monto</label>
                <input
                  type="number"
                  value={premio.monto}
                  onChange={(e) =>
                    handlePremioChange(index, "monto", e.target.value)
                  }
                  className="w-full p-2 rounded bg-black/60 border border-white/10"
                />
              </div>

              <div>
                <label className="block text-xs mb-1">Cantidad total</label>
                <input
                  type="number"
                  value={premio.cantidadTotal}
                  onChange={(e) =>
                    handlePremioChange(index, "cantidadTotal", e.target.value)
                  }
                  className="w-full p-2 rounded bg-black/60 border border-white/10"
                />
              </div>

              <div>
                <label className="block text-xs mb-1">
                  Sale a partir de venta #
                </label>
                <input
                  type="number"
                  value={premio.desbloqueoPorVentas}
                  onChange={(e) =>
                    handlePremioChange(
                      index,
                      "desbloqueoPorVentas",
                      e.target.value
                    )
                  }
                  className="w-full p-2 rounded bg-black/60 border border-white/10"
                />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <input
                type="checkbox"
                checked={premio.visible}
                onChange={(e) =>
                  handlePremioChange(index, "visible", e.target.checked)
                }
              />
              <span className="text-sm">Visible</span>
            </div>
          </div>
        ))}
      </div>

      {/* PACKS */}
      <div className="mt-10">
        <h2 className="text-2xl font-extrabold mb-4">Packs de compra</h2>
        <AdminPacks cajaId={id} />
      </div>

      {/* BOTONES ACCIONES */}
      <div className="flex gap-4 mt-10">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-yellow-500 text-black px-6 py-3 rounded-xl font-extrabold hover:bg-yellow-400 disabled:opacity-50"
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>

        <button
          onClick={() => navigate("/admin/cajas")}
          className="border border-white/20 px-6 py-3 rounded-xl"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
