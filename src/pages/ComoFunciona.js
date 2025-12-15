import { Link } from "react-router-dom";

export default function ComoFunciona() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        ¿Cómo funciona Sorteos LXM?
      </h1>

      <section className="mb-6">
        <h2 className="text-xl font-bold mb-2">🎟️ 1. Elegís un sorteo</h2>
        <p className="text-gray-700">
          En nuestra página vas a encontrar distintos sorteos activos.  
          Cada sorteo tiene un premio, un valor por chance y una cantidad limitada de participaciones.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-bold mb-2">💳 2. Comprás tu chance</h2>
        <p className="text-gray-700">
          Para participar, ingresás tu WhatsApp y realizás el pago a través de
          MercadoPago.  
          Una vez aprobado el pago, tu chance queda registrada automáticamente.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-bold mb-2">📲 3. Registro y confirmación</h2>
        <p className="text-gray-700">
          Cuando el pago se acredita, tu participación queda guardada con tu número
          de contacto.  
          No necesitás enviar comprobantes ni realizar pasos adicionales.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-bold mb-2">🏆 4. Sorteo del ganador</h2>
        <p className="text-gray-700">
          Una vez que se venden todas las chances (o se cierra el sorteo),
          se realiza el sorteo y se publica el ganador.  
          El ganador es contactado directamente por WhatsApp.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-bold mb-2">⚠️ Importante</h2>
        <ul className="list-disc pl-5 text-gray-700 space-y-2">
          <li>Las chances son limitadas y no se puede sobrepasar el cupo.</li>
          <li>Una vez realizado el pago, no se aceptan devoluciones.</li>
          <li>MercadoPago actúa únicamente como procesador de pagos.</li>
          <li>Sorteos LXM es responsable de la organización y entrega del premio.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-2">📩 Contacto</h2>
        <p className="text-gray-700">
          Ante cualquier duda o consulta podés escribirnos por WhatsApp o
          a través de nuestras redes oficiales.
        </p>
      </section>

      <div className="text-center">
        <Link
          to="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
