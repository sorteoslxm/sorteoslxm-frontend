// FILE: /Users/mustamusic/web/sorteos-lxm/src/components/AdminRoute.js

import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const [valid, setValid] = useState(null); // null = cargando
  const token = localStorage.getItem("admin_token");

  useEffect(() => {
    const validar = async () => {
      if (!token) {
        setValid(false);
        return;
      }

      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/admin/validate`,
          {
            headers: {
              "x-admin-token": token,
            },
          }
        );

        if (res.ok) {
          setValid(true);
        } else {
          localStorage.removeItem("admin_token");
          setValid(false);
        }
      } catch (err) {
        console.error("Error validando admin:", err);
        setValid(false);
      }
    };

    validar();
  }, [token]);

  // ⏳ Cargando
  if (valid === null) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        Verificando acceso...
      </div>
    );
  }

  // 🚫 No autorizado
  if (!valid) {
    return <Navigate to="/admin/login" replace />;
  }

  // ✅ Autorizado
  return children;
}
