// FILE: src/components/AdminRoute.js

import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const [valid, setValid] = useState(null);
  const token = localStorage.getItem("adminToken");

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
          localStorage.removeItem("adminToken");
          setValid(false);
        }
      } catch (err) {
        console.error("Error validando admin:", err);
        setValid(false);
      }
    };

    validar();
  }, [token]);

  if (valid === null) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        Verificando acceso...
      </div>
    );
  }

  if (!valid) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
