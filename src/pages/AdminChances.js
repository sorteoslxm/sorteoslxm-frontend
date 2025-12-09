// FILE: src/pages/AdminChances.js
import { useEffect, useState } from "react";
import "./AdminChances.css";

export default function AdminChances() {
  const [sorteos, setSorteos] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        // 1) Traer sorteos
        const resSorteos = await fetch("https://sorteoslxm-server-clean.onrender.com/sorteos");
        const listaSorteos = await resSorteos.json();

        // 2) Traer chances REALES guardadas por el webhook
        const resChances = await fetch("https://sorteoslxm-server-clean.onrender.com/chances?limit=5000");
        const listaChances = await resChances.json();

        console.log("Chances recibidas:", listaChances);

        // 3) Agrupar chances por sorteoId
        const agrupados = listaSorteos.map(s => {
          const chancesDeEste = listaChances.filter(c => c.sorteoId === s.id);

          return {
            ...s,
            vendidos: chancesDeEste.filter(c => c.mpStatus === "approved").length,
            pendientes: chancesDeEste.filter(c => c.mpStatus === "pending").length,
            rechazados: chancesDeEste.filter(c => c.mpStatus === "rejected").length,

            restantes: s.numerosTotales
              ? (s.numerosTotales - chancesDeEste.filter(c => c.mpStatus === "approved").length)
              : 0,

            chancesVendidas: chancesDeEste
          };
        });

        setSorteos(agrupados);

      } catch (err) {
        console.log("Error cargando admin chances:", err);
      }
    }

    loadData();
  }, []);

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
            <table>
              <thead>
                <tr>
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
                    <td>{c.numero}</td>
                    <td>{c.telefono || "—"}</td>
                    <td className={
  c.mpStatus === "approved"
    ? "approved"
    : c.mpStatus === "pending"
    ? "pending"
    : "rejected"
}>
  {c.mpStatus || "—"}
</td>

                    <td>{c.mpPaymentId || "—"}</td>
                    <td>{new Date(c.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
    </div>
  );
}
