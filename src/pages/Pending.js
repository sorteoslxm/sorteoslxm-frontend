import { Link } from "react-router-dom";

export default function Pending() {
  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold text-yellow-500 mb-4">
        ⏳ Pago pendiente
      </h1>

      <p className="mb-4">
        Estamos esperando la confirmación del pago.
      </p>

      <p className="mb-6">
        ⏱️ Esto puede demorar algunos minutos.<br />
        Si el pago se aprueba, tus chances se asignarán automáticamente.
      </p>

      <Link
        to="/"
        className="inline-block bg-blue-600 text-white px-6 py-2 rounded"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
