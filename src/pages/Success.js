import { Link } from "react-router-dom";

function Success() {
  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h1>Pago aprobado ✅</h1>
      <Link to="/">Volver a sorteos</Link>
    </div>
  );
}

export default Success;
