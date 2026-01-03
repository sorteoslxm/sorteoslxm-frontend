// FILE: web/sorteos-lxm/src/pages/AdminEditarCaja.js
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_URL from "../config/api";

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

        if (!res.ok) throw new Error(data.message || "Error cargando caja");

        setCaja(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCaja();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCaja((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Error guardando caja");

      navigate("/admin/cajas");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-white">Cargando caja...</div>;
  }

  if (error) {
    return <div className="p-10 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8 text-white">
      <h1 className="text-3xl font-extrabold mb-8">Editar Caja</h1>

      <div className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/10">
        <div>
          <label className="block text-sm mb-1">Título</label>
          <input
            name="titulo"
            value={caja.titulo || ""}
            onChange={handleChange}
            className="w-full p-3 rounded bg-black/40 border border-white/10"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Slug</label>
          <input
            name="slug"
            value={caja.slug || ""}
            disabled
            className="w-full p-3 rounded bg-black/20 border border-white/10 opacity-50"
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

        <div className="flex gap-4 pt-4">
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
    </div>
  );
}
