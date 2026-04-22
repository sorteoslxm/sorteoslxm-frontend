// FILE: src/pages/AdminChances.js
import { useEffect, useState } from "react";
import API_URL from "../config/api";
import "./AdminChances.css";

export default function AdminChances() {
  const [sorteos, setSorteos] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState({});
  const [borrando, setBorrando] = useState(false);

  const cargarDatos = async () => {
    try {
      const resSorteos = await fetch(`${API_URL}/sorteos`);
      const listaSorteos = await resSorteos.json();

      const resChances = await fetch(`${API_URL}/chances?limit=5000`);
      const listaChances = await resChances.json();

      const agrupados = listaSorteos.map((s) => {
        const chancesDeEste = listaChances.filter((c) => c.sorteoId === s.id);

        return {
          ...s,
          vendidos: chancesDeEste.filter((c) => c.mpStatus === "approved").length,
          pendientes: chancesDeEste.filter((c) => c.mpStatus === "pending").length,
          rechazados: chancesDeEste.filter((c) => c.mpStatus === "rejected").length,
          restantes: s.numerosTotales
            ? s.numerosTotales -
              chancesDeEste.filter((c) => c.mpStatus === "approved").length
            : 0,
          chancesVendidas: chancesDeEste,
        };
      });

      setSorteos(agrupados);
    } catch (err) {
      console.log("Error cargando admin chances:", err);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const toggleChance = (chanceId) => {
    setSeleccionadas((prev) => ({
      ...prev,
      [chanceId]: !prev[chanceId],
    }));
  };

  const toggleTodas = (chances) => {
    const ids = chances.map((c) => c.id);
    const todasSeleccionadas = ids.every((id) => seleccionadas[id]);

    setSeleccionadas((prev) => {
      const next = { ...prev };
      ids.forEach((id) => {
        next[id] = !todasSeleccionadas;
      });
      return next;
    });
  };

  const borrarSeleccionadas = async (chances) => {
    const ids = chances
      .map((c) => c.id)
      .filter((id) => seleccionadas[id]);

    if (ids.length === 0) {
      alert("Seleccioná al menos una chance.");
      return;
    }

    if (!window.confirm(`¿Eliminar ${ids.length} chance(s)?`)) return;

    try {
      setBorrando(true);
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_URL}/chances/bulk`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify({ ids }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Error eliminando chances");
      }

      setSeleccionadas((prev) => {
        const next = { ...prev };
        ids.forEach((id) => {
          delete next[id];
        });
        return next;
      });

      await cargarDatos();
      alert(`✅ Chances eliminadas: ${data.eliminadas || ids.length}`);
    } catch (err) {
      alert(err.message || "Error eliminando chances");
    } finally {
      setBorrando(false);
    }
  };

  return (
    <div className="admin-chances-container">
      <h1>🎟️ Panel de Chances (MP + Webhook)</h1>

      {sorteos.map(s => (
        <div key={s.id} className="sorteo-box">
          <h2>{s.titulo}</h2>

          <div className="stats">
            <p><b>Aprobados:</b> {s.vendidos}</p>
            <p><b>Pendientes:</b> {s.pendientes}</p>
            <p><b>Rechazados:</b> {s.rechazados}</p>
            <p><b>Restantes:</b> {s.restantes}</p>
            <p><b>Total inicial:</b> {s.numerosTotales}</p>
          </div>

          <h3>Listado de Chances</h3>

          {s.chancesVendidas.length === 0 ? (
            <p className="sin-chances">Sin chances vendidas</p>
          ) : (
            <>
              <div style={{ marginBottom: 12, display: "flex", gap: 10 }}>
                <button
                  onClick={() => toggleTodas(s.chancesVendidas)}
                  disabled={borrando}
                >
                  Seleccionar todas
                </button>
                <button
                  onClick={() => borrarSeleccionadas(s.chancesVendidas)}
                  disabled={borrando}
                >
                  {borrando ? "Eliminando..." : "Eliminar seleccionadas"}
                </button>
              </div>

              <table>
                <thead>
                  <tr>
                    <th></th>
                    <th>Chance</th>
                    <th>Teléfono</th>
                    <th>Estado</th>
                    <th>MP ID</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {s.chancesVendidas.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={Boolean(seleccionadas[c.id])}
                          onChange={() => toggleChance(c.id)}
                        />
                      </td>
                      <td>{c.numero}</td>
                      <td>{c.telefono || "—"}</td>
                      <td
                        className={
                          c.mpStatus === "approved"
                            ? "approved"
                            : c.mpStatus === "pending"
                              ? "pending"
                              : "rejected"
                        }
                      >
                        {c.mpStatus || "—"}
                      </td>
                      <td>{c.mpPaymentId || "—"}</td>
                      <td>{new Date(c.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
