// FILE: web/sorteos-lxm/src/pages/AdminCajas.js
import React, { useState } from "react";

export default function AdminCajas() {
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
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">
        Crear / Editar Caja
      </h2>

      {/* PREMIOS */}
      <div className="space-y-4">
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
                {/* NOMBRE */}
                <div>
                  <label className="text-xs text-gray-400">
                    Nombre del premio
                  </label>
                  <input
                    value={p.nombre || ""}
                    placeholder="Ej: Premios $10.000"
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

                {/* MONTO */}
                <div>
                  <label className="text-xs text-gray-400">
                    Monto
                  </label>
                  <input
                    type="number"
                    value={p.monto || ""}
                    placeholder="Ej: 10000"
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

                {/* CANTIDAD TOTAL (INTERNO) */}
                <div>
                  <label className="text-xs text-gray-400">
                    Cantidad total (interno)
                  </label>
                  <input
                    type="number"
                    value={p.cantidadTotal || ""}
                    placeholder="Ej: 6"
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

                {/* DESBLOQUEO (INTERNO) */}
                <div>
                  <label className="text-xs text-gray-400">
                    Se desbloquea en la venta #
                  </label>
                  <input
                    type="number"
                    value={p.desbloqueoPorVentas || ""}
                    placeholder="Ej: 30"
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

              {/* VISIBILIDAD */}
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

              <p className="text-xs text-gray-500">
                ⚠️ Cantidad y desbloqueo son solo
                para control interno
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
