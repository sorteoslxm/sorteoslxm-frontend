// FILE: src/pages/AdminChances.js
import { useEffect, useState } from "react";
import "./AdminChances.css";

export default function AdminChances() {
  const [sorteos, setSorteos] = useState([]);

  useEffect(() => {
    fetch("https://sorteoslxm-server-clean.onrender.com/sorteos")
      .then(res => res.json())
      .then(data => {
        const conChances = data.map(s => ({
          ...s,
          vendidos: s.chancesVendidas?.length || 0,
          restantes: s.numerosTotales
        }));
        setSorteos(conChances);
      })
      .catch(e => console.log("Error:", e));
  }, []);

  return (
    <div className="admin-chances-container">
      <h1>🎟️ Panel de Chances</h1>

      {sorteos.map(s => (
        <div key={s.id} className="sorteo-box">
          <h2>{s.titulo || "Sin título"}</h2>

          <div className="stats">
            <p><b>Vendidos:</b> {s.vendidos}</p>
            <p><b>Restantes:</b> {s.restantes}</p>
            <p><b>Total inicial:</b> {s.vendidos + s.restantes}</p>
          </div>

          <h3>Listado de Chances</h3>

          {(s.chancesVendidas?.length || 0) === 0 ? (
            <p className="sin-chances">Sin chances vendidas</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Chance</th>
                  <th>Comprador</th>
                  <th>Teléfono</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {s.chancesVendidas.map((c, i) => (
                  <tr key={i}>
                    <td>{c.numero}</td>
                    <td>{c.comprador}</td>
                    <td>{c.telefono || "—"}</td>
                    <td>{new Date(c.fecha).toLocaleString()}</td>
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
