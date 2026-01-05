import { useEffect, useState } from "react";
import API_URL from "../config/api";

export default function AdminPacks({ cajaId }) {
  const [packs, setPacks] = useState([]);

  useEffect(() => {
    if (!cajaId) return;

    fetch(`${API_URL}/admin/packs/${cajaId}`)
      .then((r) => r.json())
      .then(setPacks);
  }, [cajaId]);

  const addPack = () => {
    if (packs.length >= 5) return;
    setPacks([
      ...packs,
      {
        cantidad: "",
        precio: "",
        destacado: false,
      },
    ]);
  };

  const updatePack = (i, field, value) => {
    const copy = [...packs];
    copy[i][field] = value;
    setPacks(copy);
  };

  const setDestacado = (i) => {
    setPacks(
      packs.map((p, index) => ({
        ...p,
        destacado: index === i,
      }))
    );
  };

  const savePacks = async () => {
    await fetch(`${API_URL}/admin/packs/${cajaId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ packs }),
    });

    alert("Packs guardados");
  };

  return (
    <div className="space-y-4 bg-zinc-900 p-4 rounded-xl border border-zinc-700">
      <h3 className="text-lg font-bold text-yellow-400">
        🎯 Packs de compra
      </h3>

      {packs.map((p, i) => (
        <div
          key={i}
          className="grid grid-cols-4 gap-2 items-end bg-black p-3 rounded"
        >
          <div>
            <label className="text-xs text-gray-400">Chances</label>
            <input
              type="number"
              value={p.cantidad}
              onChange={(e) =>
                updatePack(i, "cantidad", Number(e.target.value))
              }
              className="w-full bg-zinc-800 p-2 rounded"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400">Precio</label>
            <input
              type="number"
              value={p.precio}
              onChange={(e) =>
                updatePack(i, "precio", Number(e.target.value))
              }
              className="w-full bg-zinc-800 p-2 rounded"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="radio"
              checked={p.destacado}
              onChange={() => setDestacado(i)}
            />
            <span className="text-sm">Más vendido</span>
          </div>

          <button
            className="bg-red-600 text-white rounded p-2"
            onClick={() =>
              setPacks(packs.filter((_, index) => index !== i))
            }
          >
            ✕
          </button>
        </div>
      ))}

      <div className="flex gap-2">
        <button
          onClick={addPack}
          className="bg-zinc-700 px-4 py-2 rounded"
        >
          + Agregar pack
        </button>

        <button
          onClick={savePacks}
          className="bg-yellow-500 text-black px-6 py-2 rounded font-bold"
        >
          Guardar packs
        </button>
      </div>
    </div>
  );
}
