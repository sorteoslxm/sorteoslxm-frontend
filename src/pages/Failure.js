import { Link } from "react-router-dom";

export default function Failure() {
  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold text-red-600 mb-4">
        ❌ El pago no se pudo completar
      </h1>

      <p className="mb-4">
        No se realizó ningún cobro.
      </p>

      <p className="mb-6">
        Podés intentar nuevamente o usar otro medio de pago.
      </p>

      <Link
        to="/"
        className="inline-block bg-blue-600 text-white px-6 py-2 rounded"
      >
        Volver al sorteo
      </Link>
    </div>
  );
}
