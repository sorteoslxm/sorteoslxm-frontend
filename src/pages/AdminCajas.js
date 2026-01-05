// FILE: web/sorteos-lxm/src/pages/AdminCajas.js
import React, { useState } from "react";
import AdminPacks from "../components/AdminPacks";

export default function AdminCajas({ cajaId }) {
  const [form, setForm] = useState({
    nombre: "",
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
        nombre: "Premios $20.000",
        monto: "",
        cantidadTotal: "",
        desbloqueoPorVentas: "",
        visible: true,
        esMayor: false,
      },
      {
        nombre: "Premios $10.000",
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
  });

  /* =========================
     PREMIOS
  ========================= */
  const handlePremioChange = (index, field, value) => {
    setForm((prev) => {
      const premios = [...prev.premios];
      premios[index] = {
        ...premios[index],
        [field]: value,
      };
      return { ...prev, premios };
    });
  };

  return (
    <div className="space-y-10">
      <h2 className="text-xl font-bold text-white">
        Crear / Editar Caja
      </h2>

      {/* ================= PREMIOS ================= */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-yellow-400">
          🎁 Premios
        </h3>

        {[...form.premios]
          .sort(
            (a, b) =>
              (b.esMayor === true) - (a.esMayor === true)
          )
          .map((p, i) => (
            <div
              key={i}
              className="bg-zinc-800 p-4 rounded-xl space-y-3 border border-zinc-700"
            >
              <h4 className="font-bold text-yellow-400">
                {p.esMayor
                  ? "🏆 Premio Mayor"
                  : "Premio"}
              </h4>

              <div className="grid md:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs text-gray-400">
                    Nombre
                  </label>
                  <input
                    value={p.nombre || ""}
                    onChange={(e) =>
                      handlePremioChange(
                        i,
                        "nombre",
                        e.target.value
                      )
                    }
                    className="bg-black p-2 rounded w-full"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400">
                    Monto
                  </label>
                  <input
                    type="number"
                    value={p.monto || ""}
                    onChange={(e) =>
                      handlePremioChange(
                        i,
                        "monto",
                        e.target.value
                      )
                    }
                    className="bg-black p-2 rounded w-full"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400">
                    Cantidad total (interno)
                  </label>
                  <input
                    type="number"
                    value={p.cantidadTotal || ""}
                    onChange={(e) =>
                      handlePremioChange(
                        i,
                        "cantidadTotal",
                        e.target.value
                      )
                    }
                    className="bg-black p-2 rounded w-full"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400">
                    Desbloqueo venta #
                  </label>
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
                    className="bg-black p-2 rounded w-full"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm mt-2 text-gray-300">
                <input
                  type="checkbox"
                  checked={p.visible}
                  onChange={(e) =>
                    handlePremioChange(
                      i,
                      "visible",
                      e.target.checked
                    )
                  }
                />
                Visible en la web
              </label>
            </div>
          ))}
      </div>

      {/* ================= PACKS ================= */}
      {cajaId && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-yellow-400">
            💰 Packs de compra
          </h3>

          <AdminPacks cajaId={cajaId} />
        </div>
      )}
    </div>
  );
}
