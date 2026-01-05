import { useEffect, useState } from "react";
import API_URL from "../config/api";

export default function AdminPacks({ cajaId }) {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    cantidad: "",
    precio: "",
    destacado: false,
    activo: true,
  });

  /* =========================
     CARGAR PACKS
  ========================= */
  const loadPacks = async () => {
    if (!cajaId) return;

    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/admin/packs?cajaId=${cajaId}`
      );
      const data = await res.json();
      setPacks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando packs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPacks();
  }, [cajaId]);

  /* =========================
     CREAR PACK
  ========================= */
  const crearPack = async () => {
    if (!form.cantidad || !form.precio) {
      alert("Completá cantidad y precio");
      return;
    }

    try {
      await fetch(`${API_URL}/admin/packs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          cajaId,
        }),
      });

      setForm({
        cantidad: "",
        precio: "",
        destacado: false,
        activo: true,
      });

      loadPacks();
    } catch (err) {
      console.error("Error creando pack:", err);
    }
  };

  /* =========================
     TOGGLES
  ========================= */
  const toggleCampo = async (id, campo, valorActual) => {
    try {
      await fetch(`${API_URL}/admin/packs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          [campo]: !valorActual,
        }),
      });

      loadPacks();
    } catch (err) {
      console.error("Error actualizando pack:", err);
    }
  };

  return (
    <div className="space-y-6">

      {/* ===== CREAR PACK ===== */}
      <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-700 space-y-3">
        <h4 className="text-yellow-400 font-bold">
          ➕ Nuevo pack
        </h4>

        <div className="grid md:grid-cols-4 gap-3">
          <input
            type="number"
            placeholder="Cantidad de chances"
            value={form.cantidad}
            onChange={(e) =>
              setForm({ ...form, cantidad: e.target.value })
            }
            className="bg-black p-2 rounded"
          />

          <input
            type="number"
            placeholder="Precio"
            value={form.precio}
            onChange={(e) =>
              setForm({ ...form, precio: e.target.value })
            }
            className="bg-black p-2 rounded"
          />

          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={form.destacado}
              onChange={(e) =>
                setForm({ ...form, destacado: e.target.checked })
              }
            />
            Destacado
          </label>

          <button
            onClick={crearPack}
            className="bg-yellow-400 text-black font-bold rounded px-4"
          >
            Crear
          </button>
        </div>
      </div>

      {/* ===== LISTA PACKS ===== */}
      <div className="space-y-3">
        <h4 className="text-yellow-400 font-bold">
          💰 Packs cargados
        </h4>

        {loading ? (
          <p className="text-gray-400">Cargando packs…</p>
        ) : packs.length === 0 ? (
          <p className="text-gray-400">No hay packs aún</p>
        ) : (
          packs.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between bg-zinc-800 p-3 rounded border border-zinc-700"
            >
              <div>
                <p className="font-bold text-white">
                  {p.cantidad} chances — $
                  {Number(p.precio).toLocaleString()}
                </p>
                <p className="text-xs text-gray-400">
                  {p.activo ? "Activo" : "Inactivo"}{" "}
                  {p.destacado && "· Destacado"}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    toggleCampo(p.id, "activo", p.activo)
                  }
                  className="text-xs px-3 py-1 rounded bg-black border"
                >
                  {p.activo ? "Desactivar" : "Activar"}
                </button>

                <button
                  onClick={() =>
                    toggleCampo(p.id, "destacado", p.destacado)
                  }
                  className="text-xs px-3 py-1 rounded bg-black border"
                >
                  Destacar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
