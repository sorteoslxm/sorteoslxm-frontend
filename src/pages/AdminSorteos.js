// FILE: web/sorteos-lxm/src/pages/AdminSorteos.js
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminSorteos() {
  const [sorteos, setSorteos] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    axios.get("/api/sorteos").then((res) => setSorteos(res.data));
  }, []);

  const seleccionar = (s) => {
    setSelected({
      ...s,
      activarAutoUltimas: s.activarAutoUltimas || 0,
      textoCuentaRegresiva: s.textoCuentaRegresiva || "",
    });
  };

  const guardarCambios = async () => {
    if (!selected) return;

    await axios.put(`/api/sorteos/${selected.id}`, {
      ...selected,
      activarAutoUltimas: Number(selected.activarAutoUltimas),
    });

    alert("Guardado correctamente ✔️");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Administrar Sorteos</h2>

      {/* LISTA DE SORTEOS */}
      <div style={{ marginBottom: 20 }}>
        {sorteos.map((s) => (
          <div
            key={s.id}
            style={{
              padding: 10,
              borderBottom: "1px solid #ccc",
              cursor: "pointer",
              background: selected?.id === s.id ? "#eef" : "transparent",
            }}
            onClick={() => seleccionar(s)}
          >
            <b>{s.titulo}</b>
          </div>
        ))}
      </div>

      {/* PANEL DE EDICIÓN */}
      {selected && (
        <div
          style={{
            padding: 20,
            border: "1px solid #ccc",
            borderRadius: 8,
            background: "#fafafa",
          }}
        >
          <h3>Editar: {selected.titulo}</h3>

          {/* CONTADOR REGRESIVO MANUAL */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontWeight: "bold" }}>Mostrar contador manual:</label>
            <br />

            <input
              type="checkbox"
              checked={selected.mostrarCuentaRegresiva}
              onChange={(e) =>
                setSelected({
                  ...selected,
                  mostrarCuentaRegresiva: e.target.checked,
                })
              }
            />
            {"  "}
            Activar manualmente
          </div>

          {/* TEXTO DEL CONTADOR */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontWeight: "bold" }}>Texto del contador:</label>
            <input
              type="text"
              style={{
                width: "100%",
                padding: 8,
                marginTop: 6,
                borderRadius: 6,
                border: "1px solid #aaa",
              }}
              value={selected.textoCuentaRegresiva}
              onChange={(e) =>
                setSelected({
                  ...selected,
                  textoCuentaRegresiva: e.target.value,
                })
              }
            />
          </div>

          {/* CONTADOR AUTOMÁTICO */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontWeight: "bold" }}>
              Activar automáticamente cuando queden:
            </label>
            <br />

            <input
              type="number"
              style={{
                padding: 8,
                marginTop: 6,
                width: 150,
                borderRadius: 6,
                border: "1px solid #aaa",
              }}
              value={selected.activarAutoUltimas}
              onChange={(e) =>
                setSelected({
                  ...selected,
                  activarAutoUltimas: e.target.value,
                })
              }
            />{" "}
            chances
          </div>

          {/* GUARDAR */}
          <button
            onClick={guardarCambios}
            style={{
              padding: "10px 25px",
              border: "none",
              borderRadius: 6,
              background: "#007bff",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Guardar Cambios
          </button>
        </div>
      )}
    </div>
  );
}
