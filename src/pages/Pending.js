import React from "react";

export default function Pending() {
  return (
    <div style={{ textAlign: "center", marginTop: "60px" }}>
      <h1 style={{ color: "#eab308" }}>⌛ Pago pendiente</h1>
      <p style={{ marginTop: "20px" }}>
        MercadoPago está procesando tu pago.  
        Se confirmará automáticamente apenas se acredite.
      </p>
    </div>
  );
}
