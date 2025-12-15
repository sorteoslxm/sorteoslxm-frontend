import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";

export default function Success() {
  const [params] = useSearchParams();

  const status = params.get("status");
  const paymentId = params.get("payment_id");

  useEffect(() => {
    console.log("Pago exitoso:", { status, paymentId });
  }, [status, paymentId]);

  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        ✅ ¡Pago realizado con éxito!
      </h1>

      <p className="mb-4">
        Tu compra fue registrada correctamente.
      </p>

      <div className="bg-gray-100 p-4 rounded mb-4 text-left">
        <p><b>ID de pago:</b> {paymentId}</p>
        <p><b>Estado:</b> Aprobado</p>
      </div>

      <p className="mb-6">
        🎟️ Tus chances ya están participando del sorteo.<br />
        Te avisaremos si resultás ganador.
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
