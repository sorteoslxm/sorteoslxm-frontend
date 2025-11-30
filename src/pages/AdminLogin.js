// FILE: src/pages/AdminLogin.js

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!data.success || !data.token) {
        setError(data.error || "Contraseña incorrecta");
        return;
      }

      // 💥 TOKEN UNIFICADO
      localStorage.setItem("adminToken", data.token);

      navigate("/admin");
    } catch (err) {
      setError("Error de conexión");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={login}>
        <h2>Admin</h2>

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error">{error}</p>}

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
