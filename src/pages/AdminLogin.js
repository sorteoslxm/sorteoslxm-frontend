import { useState } from "react";
import API_URL from "../config/api";

export default function AdminLogin() {
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      console.log("Respuesta login admin:", data);

      if (data.success) {
        localStorage.setItem("adminLogged", "true");
        alert("Login correcto!");
        window.location.href = "/admin/home";
      } else {
        alert("Contraseña incorrecta");
      }

    } catch (err) {
      console.error("Error login admin:", err);
      alert("Error conectando con el servidor");
    }
  };

  return (
    <div style={{ padding: 50, textAlign: "center" }}>
      <h2>Panel Admin</h2>
      <input
        placeholder="Contraseña"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={login}>Entrar</button>
    </div>
  );
}
