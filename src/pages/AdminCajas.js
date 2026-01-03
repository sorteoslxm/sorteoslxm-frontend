// FILE: web/sorteos-lxm/src/pages/AdminCajas.js
{form.premios.map((p, i) => (
  <div
    key={i}
    className="bg-zinc-800 p-4 rounded-xl space-y-3"
  >
    <h4 className="font-bold text-yellow-400">
      Premio #{i + 1}
    </h4>

    <div className="grid md:grid-cols-4 gap-3">
      <div>
        <label className="text-xs text-gray-400">
          Nombre
        </label>
        <input
          value={p.nombre}
          onChange={(e) =>
            handlePremioChange(i, "nombre", e.target.value)
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
          value={p.monto}
          onChange={(e) =>
            handlePremioChange(i, "monto", e.target.value)
          }
          className="bg-black p-2 rounded w-full"
        />
      </div>

      <div>
        <label className="text-xs text-gray-400">
          Cantidad total
        </label>
        <input
          type="number"
          value={p.cantidadTotal}
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
          Desbloqueo por ventas
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

    <label className="flex items-center gap-2 text-sm mt-2">
      <input
        type="checkbox"
        checked={p.visible}
        onChange={(e) =>
          handlePremioChange(i, "visible", e.target.checked)
        }
      />
      Visible en la web
    </label>
  </div>
))}
