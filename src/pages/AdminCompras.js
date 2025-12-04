// FILE: /Users/mustamusic/web/sorteos-lxm/src/pages/AdminCompras.js
import React, { useEffect, useState } from "react";
import API_URL from "../config/api";
import { useNavigate } from "react-router-dom";

export default function AdminCompras() {
  const [compras, setCompras] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) navigate("/admin/login");
  }, [navigate]);

  const fetchCompras = async () => {
    try {
      const res = await fetch(`${API_URL}/compras`);
      const data = await res.json();
      setCompras(data);
    } catch (err) {
      console.error("Error cargando compras:", err);
    }
  };

  useEffect(() => {
    fetchCompras();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Compras</h1>

      <div className="grid gap-4">
        {compras.map((c) => (
          <div key={c.id} className="bg-white shadow rounded p-4">
            <div className="flex justify-between">
              <div>
                <div className="font-bold">{c.sorteoId || "—"}</div>
                <div className="text-sm">Compra: {c.id}</div>
                <div className="text-sm">Precio: ${c.precio}</div>
                <div className="text-sm">Tel: {c.telefono}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{c.estado}</div>
                <div className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</div>
              </div>
            </div>
            {c.payerEmail && <div className="mt-2 text-sm">Email: {c.payerEmail}</div>}
            {c.mpPreferenceId && <div className="mt-1 text-xs">Pref: {c.mpPreferenceId}</div>}
            {c.mpPaymentId && <div className="mt-1 text-xs">Pago: {c.mpPaymentId}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
