// FILE: web/sorteos-lxm/src/pages/AdminCompras.js
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminCompras() {
  const [compras, setCompras] = useState([]);

  useEffect(() => {
    axios.get("/api/compras").then(res => setCompras(res.data));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Listado de Compras</h2>

      {compras.map(c => (
        <div key={c.id} style={{ padding: 10, borderBottom: "1px solid #ccc" }}>
          <b>{c.userEmail}</b> compró {c.cantidad} chances  
          <br />
          Tel: {c.telefono}
          <br />
          Estado: {c.status}
        </div>
      ))}
    </div>
  );
}
