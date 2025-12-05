import React from "react";

export default function Failure() {
  return (
    <div style={{ textAlign: "center", marginTop: "60px" }}>
      <h1 style={{ color: "red" }}>❌ Pago rechazado</h1>
      <p style={{ marginTop: "20px" }}>
        Hubo un problema con el pago.  
        Podés intentar nuevamente desde la página del sorteo.
      </p>
    </div>
  );
}
