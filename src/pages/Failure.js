import React from "react";

const Failure = () => {
  return (
    <div style={styles.container}>
      <h1 style={{ color: "#d63031" }}>❌ Pago rechazado</h1>
      <p>Tu pago no pudo ser procesado. Podés intentar nuevamente o elegir otro método de pago.</p>
      <a href="/" style={styles.link}>Volver al inicio</a>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "80px 20px",
    fontFamily: "Arial, sans-serif",
  },
  link: {
    display: "inline-block",
    marginTop: "30px",
    padding: "10px 20px",
    backgroundColor: "#d63031",
    color: "#fff",
    borderRadius: "8px",
    textDecoration: "none",
  },
};

export default Failure;
