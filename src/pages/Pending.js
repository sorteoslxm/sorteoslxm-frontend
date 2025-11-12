import React from "react";

const Pending = () => {
  return (
    <div style={styles.container}>
      <h1 style={{ color: "#fdcb6e" }}>⏳ Pago pendiente</h1>
      <p>Estamos esperando la confirmación del pago. Te avisaremos cuando se complete.</p>
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
    backgroundColor: "#fdcb6e",
    color: "#000",
    borderRadius: "8px",
    textDecoration: "none",
  },
};

export default Pending;
